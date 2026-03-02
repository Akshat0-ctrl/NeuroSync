/**
 * NeuroSync Global Theme Handler
 * Manages light/dark mode transitions and persistence.
 */

function applyTheme(theme) {
    const isLight = theme === 'light';
    const themeIcon = document.querySelector('#theme-toggle .material-symbols-outlined');

    if (isLight) {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        // Update core CSS variables
        document.documentElement.style.setProperty('--bg-primary', '#FAF8FF');
        document.documentElement.style.setProperty('--bg-secondary', '#F3EEFF');
        document.documentElement.style.setProperty('--bg-tertiary', '#EDE9FE');
        document.documentElement.style.setProperty('--text-primary', '#1E1030');
        document.documentElement.style.setProperty('--text-secondary', '#4B3D6B');
        document.documentElement.style.setProperty('--border-primary', '#DDD6FE');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    } else {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        // Update core CSS variables
        document.documentElement.style.setProperty('--bg-primary', '#120B1A');
        document.documentElement.style.setProperty('--bg-secondary', '#1A1122');
        document.documentElement.style.setProperty('--bg-tertiary', '#2A1F36');
        document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
        document.documentElement.style.setProperty('--text-secondary', '#ad92c9');
        document.documentElement.style.setProperty('--border-primary', '#2A1F36');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }
}

// Global initialization
(function () {
    // Immediate apply before DOM content loads to prevent flicker if possible
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    } else {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('theme-toggle');

        // Re-apply to ensure icons and CSS variables are correct after DOM is ready
        applyTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isCurrentlyLight = document.body.classList.contains('light');
                const newTheme = isCurrentlyLight ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme);
            });
        }
    });
})();
