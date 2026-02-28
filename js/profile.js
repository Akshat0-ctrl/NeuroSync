// Firebase v9+ compat SDK scripts (include these in your HTML head if not already present)
// <script src="https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/12.2.1/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore-compat.js"></script>

// Assume Firebase is initialized with your config elsewhere on the page

const cloudName = 'YOUR_CLOUDINARY_CLOUD_NAME'; // TODO: Replace with your actual Cloudinary cloud name
const uploadPreset = 'YOUR_UPLOAD_PRESET'; // TODO: Replace with your actual Cloudinary upload preset

// The above are example placeholder values; ensure these are correct for your Cloudinary account

function loadProfile() {
  const user = firebase.auth().currentUser;

  if (!user) {
    alert('User not logged in');
    return;
  }

  const uid = user.uid;
  const db = firebase.firestore();

  db.collection('Profiles').doc(uid).get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById('firstName').value = data.firstname || '';
        document.getElementById('lastName').value = data.lastname || '';
        document.getElementById('age').value = data.age || '';
        document.getElementById('classGrade').value = data.class || '';
        document.getElementById('role').value = data.role || 'Student';
        document.getElementById('photoUrl').value = data.photoUrl || '';
        // Set profile photo preview src
        const photoPreview = document.getElementById('profile-photo-preview');
        const placeholderText = document.getElementById('photo-placeholder-text');
        if (data.photoUrl) {
          photoPreview.src = data.photoUrl;
          if (placeholderText) placeholderText.style.display = 'none';
        } else {
          photoPreview.src = ''; // Or default image
          if (placeholderText) placeholderText.style.display = 'block';
        }

        // Update display text elements
        const displayName = document.getElementById('display-name');
        const displayRole = document.getElementById('display-role');
        if (displayName) displayName.textContent = `${data.firstname || ''} ${data.lastname || ''}`.trim() || 'Welcome!';
        if (displayRole) displayRole.textContent = data.role || 'Student';
      }
    })
    .catch((error) => {
      console.error('Error loading profile:', error);
    });
}

function saveProfile() {
  const user = firebase.auth().currentUser;

  if (!user) {
    alert('User not logged in');
    return;
  }

  // Get form field values
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const age = document.getElementById('age').value;
  const classGrade = document.getElementById('classGrade').value;
  const role = document.getElementById('role').value;
  const photoUrl = document.getElementById('photoUrl').value;

  // Get user data from Auth
  const email = user.email;
  const uid = user.uid;

  // Initialize Firestore
  const db = firebase.firestore();

  // Save to Firestore
  db.collection('Profiles').doc(uid).set({
    firstname: firstName,
    lastname: lastName,
    age: age,
    class: classGrade,
    preferredSubject: '', // Assuming not in form, can be added later
    role: role,
    photoUrl: photoUrl,
    email: email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
    .then(() => {
      // Also update display names visually without reload
      const displayName = document.getElementById('display-name');
      const displayRole = document.getElementById('display-role');
      if (displayName) displayName.textContent = `${firstName} ${lastName}`.trim() || 'Welcome!';
      if (displayRole) displayRole.textContent = role || 'Student';
    })
    .catch((error) => {
      alert('Error saving profile: ' + error.message);
    });
}

function openUploadWidget() {
  try {
    if (!window.cloudinary) {
      alert('Cloudinary widget script not loaded. Please check your internet connection and script inclusion.');
      console.error('Cloudinary widget script is not available on window.cloudinary');
      return;
    }

    if (!cloudName || !uploadPreset || cloudName === 'YOUR_CLOUDINARY_CLOUD_NAME' || uploadPreset === 'YOUR_UPLOAD_PRESET') {
      alert('Cloudinary configuration is missing. Please set your cloudName and uploadPreset in js/profile.js.');
      console.error('Cloudinary configuration missing:', { cloudName, uploadPreset });
      return;
    }

    console.log('Opening Cloudinary upload widget with:', { cloudName, uploadPreset });

    const widget = cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera', 'image_search', 'facebook', 'instagram'],
        multiple: false,
        cropping: true, // Enable cropping before upload
        croppingAspectRatio: 1, // Square aspect ratio
        folder: 'profile_photos',
        maxFileSize: 2000000, // 2MB
        clientAllowedFormats: ['png', 'jpg', 'jpeg'],
        maxImageWidth: 500,
        maxImageHeight: 500,
        showCompletedButton: true,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary widget error:', error);
          alert('Failed to upload photo: ' + error.message);
          return;
        }
        if (result && result.event === 'success') {
          console.log('Upload successful:', result.info);
          const photoUrl = result.info.secure_url;
          document.getElementById('photoUrl').value = photoUrl;
          document.getElementById('profile-photo-preview').src = photoUrl;
          const placeholderText = document.getElementById('photo-placeholder-text');
          if (placeholderText) placeholderText.style.display = 'none';

          const messageBox = document.getElementById('message');
          if (messageBox) {
            messageBox.textContent = 'Photo uploaded successfully. Please save your profile to keep changes.';
            messageBox.className = 'mt-6 p-4 rounded-xl text-sm font-medium tracking-wide text-center bg-blue-500/10 border border-blue-500/20 text-blue-400 block';
          }
        }
      }
    );

    widget.open();
  } catch (ex) {
    console.error('Exception opening Cloudinary widget:', ex);
    alert('An error occurred while opening the upload widget: ' + ex.message);
  }
}

// Make saveProfile globally available
window.saveProfile = saveProfile;
window.openUploadWidget = openUploadWidget;

// Load profile on page load
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loadProfile();
  }
});
