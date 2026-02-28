// NeuroSync Index Page JavaScript

// Dropdown functionality
document.addEventListener('DOMContentLoaded', function () {
  // Dropdown toggles
  const dropdownButtons = document.querySelectorAll('.relative.group button');
  dropdownButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const dropdown = this.parentElement.querySelector('.dropdown-menu');
      if (dropdown) {
        dropdown.classList.toggle('hidden');
        dropdown.classList.toggle('block');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.relative.group')) {
      document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('block');
      });
    }
  });

  // ============ POMODORO TIMER ============
  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  let selectedTime = 25 * 60;
  let timeLeft = selectedTime;
  let isRunning = false;
  let timerInterval;
  let currentFocus = 0;

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function updateProgress() {
    const totalTime = selectedTime;
    const elapsed = totalTime - timeLeft;
    currentFocus = Math.min((elapsed / totalTime) * 100, 100);
    progressBar.style.width = `${currentFocus}%`;
    progressText.textContent = `${Math.round(currentFocus)}%`;
  }

  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'flex';
      timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateProgress();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          isRunning = false;
          startBtn.style.display = 'flex';
          pauseBtn.style.display = 'none';
          alert('Session complete! Great job!');
          currentFocus = 100;
          updateProgress();
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.style.display = 'flex';
      pauseBtn.style.display = 'none';
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = selectedTime;
    updateDisplay();
    updateProgress();
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
  }

  // Time selection
  const timeButtons = document.querySelectorAll('#time-15, #time-25, #time-30, #time-45');
  timeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const minutes = parseInt(this.id.split('-')[1]);
      selectedTime = minutes * 60;
      resetTimer();
      timeButtons.forEach(b => b.classList.remove('bg-accent', 'text-primary'));
      this.classList.add('bg-accent', 'text-primary');
    });
  });

  // Timer controls
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  // Fullscreen focus mode
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function () {
      const body = document.body;
      const isFocusMode = body.classList.contains('focus-mode');

      if (isFocusMode) {
        body.classList.remove('focus-mode');
        fullscreenBtn.innerHTML = '<span class="material-symbols-outlined">fullscreen</span> Enter Focus Mode';
      } else {
        body.classList.add('focus-mode');
        fullscreenBtn.innerHTML = '<span class="material-symbols-outlined">fullscreen_exit</span> Exit Focus Mode';
      }
    });
  }

  updateDisplay();
  updateProgress();

  // ============ THEME TOGGLE ============
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('span');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.remove('light', 'dark');
    body.classList.add(savedTheme);

    function updateThemeIcon(theme) {
      icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function () {
      const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.classList.remove('light', 'dark');
      body.classList.add(newTheme);
      updateThemeIcon(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Hide auth buttons immediately if localStorage indicates logged in
  if (localStorage.getItem('neurosync_logged_in') === 'true') {
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.style.display = 'none';
      getStartedBtn.classList.add('hidden');
    }
    const authLink = document.querySelector('a[href="html/auth.html"]');
    if (authLink) {
      authLink.style.display = 'none';
      authLink.classList.add('hidden');
    }
  }

  // ============ FIREBASE AUTH ============
  const firebaseConfig = {
    apiKey: "AIzaSyCFQ36vxZ5qWhxXXptKe_sXlFVZxzRtCBY",
    authDomain: "neurosync-5173b.firebaseapp.com",
    projectId: "neurosync-5173b",
    storageBucket: "neurosync-5173b.firebasestorage.app",
    messagingSenderId: "855780859936",
    appId: "1:855780859936:web:3044309100db9a61fa1c45",
    measurementId: "G-75S5GWYEDK"
  };

  if (typeof firebase !== 'undefined') {
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Set local storage
        localStorage.setItem('neurosync_logged_in', 'true');

        // Hide auth buttons
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
          getStartedBtn.style.display = 'none';
          getStartedBtn.classList.add('hidden');
        }

        const authLink = document.querySelector('a[href="html/auth.html"]');
        if (authLink) {
          authLink.style.display = 'none';
          authLink.classList.add('hidden');
        }

        // Show user elements
        const navbarProfile = document.getElementById('navbar-profile');
        const dashboardLink = document.getElementById('dashboard-nav-link');
        const rewardsLink = document.getElementById('rewards-nav-link');
        const profileLink = document.getElementById('profile-nav-link');

        if (navbarProfile) navbarProfile.style.display = 'flex';
        if (dashboardLink) dashboardLink.style.display = 'flex';
        if (rewardsLink) rewardsLink.style.display = 'flex';
        if (profileLink) profileLink.style.display = 'flex';

        // Load profile data
        try {
          const doc = await db.collection('Profiles').doc(user.uid).get();
          const profileData = doc.exists ? doc.data() : {};

          const nameEl = document.getElementById('navbar-name');
          const roleEl = document.getElementById('navbar-class-role');

          if (nameEl) {
            const displayName = profileData.firstname && profileData.lastname
              ? `${profileData.firstname} ${profileData.lastname}`
              : user.displayName || user.email.split('@')[0] || 'User';
            nameEl.textContent = displayName;
          }

          if (roleEl) {
            roleEl.textContent = profileData.role || 'Student';
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      } else {
        // Remove local storage
        localStorage.removeItem('neurosync_logged_in');

        // Show auth buttons
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
          getStartedBtn.style.display = '';
          getStartedBtn.classList.remove('hidden');
        }

        const authLink = document.querySelector('a[href="html/auth.html"]');
        if (authLink) {
          authLink.style.display = '';
          authLink.classList.remove('hidden');
        }

        // Hide user elements
        const navbarProfile = document.getElementById('navbar-profile');
        const dashboardLink = document.getElementById('dashboard-nav-link');
        const rewardsLink = document.getElementById('rewards-nav-link');
        const profileLink = document.getElementById('profile-nav-link');

        if (navbarProfile) navbarProfile.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (rewardsLink) rewardsLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
      }
    });

    // ============ COMMENTS ============
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      const nameInput = document.getElementById('name-input');
      const commentInput = document.getElementById('comment-input');
      const commentsDisplay = document.getElementById('comments-display');

      function displayComments() {
        if (!commentsDisplay) return;
        commentsDisplay.innerHTML = '';
        db.collection('comments').orderBy('timestamp', 'desc').limit(10).get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              const comment = doc.data();
              const div = document.createElement('div');
              div.className = 'bg-primary/50 backdrop-blur-sm border border-primary rounded-lg p-4';
              div.innerHTML = `
                <p class="text-primary font-bold">${comment.name || 'Anonymous'}</p>
                <p class="text-secondary mt-1">${comment.text}</p>
                <span class="inline-block px-2 py-1 text-xs text-muted mt-2 bg-accent/20 rounded-full">${comment.timestamp ? new Date(comment.timestamp.toDate()).toLocaleDateString() : 'Just now'}</span>
              `;
              commentsDisplay.appendChild(div);
            });
          })
          .catch(err => console.error('Error loading comments:', err));
      }

      commentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = nameInput.value.trim() || 'Anonymous';
        const text = commentInput.value.trim();
        if (text) {
          db.collection('comments').add({
            name: name,
            text: text,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date())
          }).then(() => {
            nameInput.value = '';
            commentInput.value = '';
            displayComments();
          }).catch(err => console.error('Error adding comment:', err));
        }
      });

      displayComments();
    }

    // ============ NAVBAR DROPDOWN ============
    const navbarProfile = document.getElementById('navbar-profile');
    const navbarDropdown = document.getElementById('navbar-dropdown');

    if (navbarProfile && navbarDropdown) {
      let timeout;
      navbarProfile.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        navbarDropdown.classList.remove('hidden');
        navbarDropdown.classList.add('block');
      });
      navbarProfile.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
          navbarDropdown.classList.add('hidden');
          navbarDropdown.classList.remove('block');
        }, 2000);
      });
    }

    // Sign out
    const signOutBtn = document.getElementById('navbar-sign-out-btn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
          window.location.href = 'index.html';
        }).catch(err => console.error('Sign out error:', err));
      });
    }
  }
});
