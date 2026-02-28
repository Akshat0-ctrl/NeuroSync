// navbar.js - Navigation dropdown functionality

// Global functions for dropdown menus
window.openDropdown = function (element) {
  const dropdown = element.querySelector('div.absolute');
  if (dropdown) {
    dropdown.classList.remove('hidden');
  }
};

window.closeDropdown = function (element) {
  const dropdown = element.querySelector('div.absolute');
  if (dropdown) {
    dropdown.classList.add('hidden');
  }
};

// Initialize dropdown functionality
document.addEventListener('DOMContentLoaded', function () {
  // Handle dropdown toggle buttons
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    const dropdown = toggle.parentElement.querySelector('div.absolute');

    // Mouse enter and leave events to show/hide dropdown on hover
    toggle.addEventListener('mouseenter', () => {
      if (dropdown) {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('block');
      }
    });

    toggle.addEventListener('mouseleave', () => {
      if (dropdown) {
        setTimeout(() => {
          if (dropdown && !dropdown.matches(':hover')) {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('block');
          }
        }, 300);
      }
    });

    if (dropdown) {
      dropdown.addEventListener('mouseenter', () => {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('block');
      });

      dropdown.addEventListener('mouseleave', () => {
        setTimeout(() => {
          dropdown.classList.add('hidden');
          dropdown.classList.remove('block');
        }, 300);
      });
    }

    // Add click event to toggle dropdown menu on click
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        // Close all dropdowns first
        document.querySelectorAll('div.absolute').forEach(d => {
          d.classList.add('hidden');
          d.classList.remove('block');
        });
        // Toggle current dropdown
        if (isHidden) {
          dropdown.classList.remove('hidden');
          dropdown.classList.add('block');
        } else {
          dropdown.classList.add('hidden');
          dropdown.classList.remove('block');
        }
      }
    });
  });

  // Additional: Handle dropdown toggling for buttons inside .relative.group
  const relativeGroupButtons = document.querySelectorAll('.relative.group button');
  relativeGroupButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const dropdown = this.parentElement.querySelector('.absolute');
      if (dropdown) {
        if (dropdown.classList.contains('hidden')) {
          // Close other dropdowns first
          document.querySelectorAll('.absolute').forEach(d => {
            d.classList.add('hidden');
            d.classList.remove('block');
          });
          // Open this dropdown
          dropdown.classList.remove('hidden');
          dropdown.classList.add('block');
        } else {
          // Close this dropdown
          dropdown.classList.add('hidden');
          dropdown.classList.remove('block');
        }
      }
    });
  });

  // Close dropdowns when clicking outside any dropdown toggle or dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-toggle') && !e.target.closest('div.absolute') && !e.target.closest('.relative.group button')) {
      document.querySelectorAll('div.absolute').forEach(dropdown => {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('block');
      });
    }
  });

  // Close dropdown when clicking on any anchor inside dropdown menu to allow navigation
  const dropdownAnchors = document.querySelectorAll('div.absolute a');
  dropdownAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      const dropdown = anchor.closest('div.absolute');
      if (dropdown) {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('block');
      }
    });
  });

  // ========== DYNAMIC AUTH BUTTON HIDING ==========
  function hideAuthButtons() {
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) getStartedBtn.style.display = 'none';

    const authLinks = document.querySelectorAll('a[href="html/auth.html"], a[href="../html/auth.html"], a[href="auth.html"]');
    authLinks.forEach(link => {
      link.style.display = 'none';
      link.classList.add('hidden'); // Force Tailwind hidden
    });

    const allButtons = document.querySelectorAll('button, a, span');
    allButtons.forEach(btn => {
      if (btn.children.length === 0 || btn.tagName === 'SPAN') {
        const text = btn.textContent.trim().toLowerCase();
        if (text === 'get started' || text === 'create account' || text === 'create free account') {
          const target = btn.closest('button') || btn.closest('a') || btn;
          target.style.display = 'none';
          target.classList.add('hidden'); // Force Tailwind hidden
        }
      }
    });
  }

  // Use localStorage to hide buttons immediately before Firebase initializes
  if (localStorage.getItem('neurosync_logged_in') === 'true') {
    hideAuthButtons();
  }

  // Hook into Firebase Auth to maintain sync with session
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      // Small timeout to allow Firebase apps to initialize in other scripts
      setTimeout(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            localStorage.setItem('neurosync_logged_in', 'true');
            hideAuthButtons();
          } else {
            localStorage.removeItem('neurosync_logged_in');
          }
        });
      }, 500);
    } catch (e) {
      console.warn('Firebase auth listener failed in navbar.js', e);
    }
  }
});
