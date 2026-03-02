/**
 * NeuroSync Side Menu Component
 * Handles dynamic injection and active link highlighting across all app pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the Side Menu HTML
    const sideMenuHTML = `
        <aside id="side-menu" class="fixed top-0 left-0 h-full w-64 z-50 transition-all duration-300">
            <div class="p-6 h-full flex flex-col">
                <!-- User Profile Box -->
                <div id="side-profile-box" onclick="window.location.href='profile.html'"
                    class="flex items-center gap-3 mb-8 p-4 bg-[#2a1b38]/50 backdrop-blur-md rounded-2xl border border-white/10 cursor-pointer transition-all hover:bg-[#2a1b38]/70 hover:border-white/20">
                    <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-[0_0_15px_rgba(128,19,236,0.5)]"
                        id="side-profile-photo">
                        <span class="material-symbols-outlined text-xl text-[var(--primary-color)] flex items-center justify-center w-full h-full">person</span>
                    </div>
                    <div class="flex flex-col overflow-hidden">
                        <div class="text-white text-sm font-medium truncate" id="side-name">Loading...</div>
                        <div class="text-[#ad92c9] text-xs truncate" id="side-class-role">Student</div>
                    </div>
                </div>

                <!-- Menu Items -->
                <nav class="flex flex-col gap-1 flex-grow overflow-y-auto">
                    <a href="dashboard.html" data-path="dashboard.html" class="nav-item">
                        <span class="material-symbols-outlined text-accent">dashboard</span>
                        <span>Dashboard</span>
                    </a>
                    <a href="rewards.html" data-path="rewards.html" class="nav-item">
                        <span class="material-symbols-outlined text-accent">emoji_events</span>
                        <span>Rewards</span>
                    </a>
                    <a href="profile.html" data-path="profile.html" class="nav-item">
                        <span class="material-symbols-outlined text-accent">person</span>
                        <span>Profile</span>
                    </a>
                    <a href="study-library.html" data-path="study-library.html" class="nav-item">
                        <span class="material-symbols-outlined text-accent">library_books</span>
                        <span>Study Library</span>
                    </a>
                    <a href="mood-selection.html" data-path="mood-selection.html" class="nav-item">
                        <span class="material-symbols-outlined text-accent">mood</span>
                        <span>Mood Tracker</span>
                    </a>
                    <a href="study-library.html#upload-section" data-path="study-library.html#upload-section" class="nav-item">
                        <span class="material-symbols-outlined text-accent">upload</span>
                        <span>Upload Study Material</span>
                    </a>
                    <a href="feedback.html" data-path="feedback.html" class="nav-item">
                        <span class="material-symbols-outlined text-accent">feedback</span>
                        <span>Feedback Us</span>
                    </a>
                </nav>

                <!-- Sign Out Button at Bottom -->
                <div class="mt-auto pt-4 border-t border-white/5">
                    <a href="#" onclick="if(typeof signOut === 'function') { signOut(); } else { window.location.href='auth.html'; }" 
                       class="nav-item flex items-center gap-3 px-4 py-3 text-[#ad92c9] hover:bg-red-500/10 hover:text-red-400 transition-colors rounded-xl group/signout">
                        <span class="material-symbols-outlined text-red-400 group-hover/signout:scale-110 transition-transform">logout</span>
                        <span>Sign Out</span>
                    </a>
                </div>
            </div>
        </aside>
        
        <!-- Mobile Toggle Overlay (Hidden by default) -->
        <div id="menu-overlay" class="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 invisible transition-opacity duration-300 z-40"></div>
    `;

    // 2. Inject Sidebar if target container exists or prepend to body
    let container = document.getElementById('side-menu-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'side-menu-container';
        document.body.prepend(container);
    }
    container.innerHTML = sideMenuHTML;

    // 3. Highlight Active Link
    highlightActiveLink();

    // 4. Update Profile Info from Firebase if available
    setupFirebaseProfileUpdate();

    // 5. Setup Mobile Menu Toggle
    setupMobileMenu();
});

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');

    if (mobileMenuBtn && sideMenu && overlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sideMenu.classList.add('mobile-open');
            overlay.classList.remove('invisible', 'opacity-0');
            overlay.classList.add('opacity-100');
        });

        overlay.addEventListener('click', () => {
            sideMenu.classList.remove('mobile-open');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('invisible'), 300);
        });
    }
}

function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const page = currentPath.split('/').pop() || 'dashboard.html';
    const navLinks = document.querySelectorAll('#side-menu nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const dataPath = link.getAttribute('data-path');

        link.classList.remove('active-link');

        // Match against href or data-path
        const matchesPage = (href === page || dataPath === page);
        const matchesFull = (href === (page + currentHash) || dataPath === (page + currentHash));

        if (matchesPage || matchesFull) {
            link.classList.add('active-link');
        } else if (href && href.includes('#') && (page + currentHash).startsWith(href)) {
            link.classList.add('active-link');
        }
    });

    // Special case for dashboard root
    if (!page || page === 'index.html') {
        const dashLink = document.querySelector('a[href="dashboard.html"]');
        if (dashLink) dashLink.classList.add('active-link');
    }
}

function setupFirebaseProfileUpdate() {
    // Check if firebase and auth are available
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const docRef = db.collection('Profiles').doc(user.uid);
                    const docSnap = await docRef.get();
                    const profile = docSnap.exists ? docSnap.data() : {};

                    const sideName = document.getElementById('side-name');
                    const sideClass = document.getElementById('side-class-role');
                    const sidePhoto = document.getElementById('side-profile-photo');

                    const displayName = `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || user.displayName || user.email.split('@')[0] || 'User';

                    if (sideName) sideName.textContent = displayName;
                    if (sideClass) sideClass.textContent = profile.class || 'Student';

                    if (sidePhoto) {
                        if (profile.photoUrl) {
                            sidePhoto.style.backgroundImage = `url("${profile.photoUrl}")`;
                            sidePhoto.innerHTML = '';
                        } else {
                            sidePhoto.style.backgroundImage = 'none';
                            sidePhoto.innerHTML = '<span class="material-symbols-outlined text-xl text-[var(--primary-color)] flex items-center justify-center w-full h-full">person</span>';
                        }
                    }

                    // Dynamic Role-based Links
                    const nav = document.querySelector('#side-menu nav');
                    if (nav) {
                        // Add Teacher Dashboard if role is Teacher
                        if (profile.role === 'Teacher' && !document.querySelector('a[href="teacher-dashboard.html"]')) {
                            const teacherLink = document.createElement('a');
                            teacherLink.href = 'teacher-dashboard.html';
                            teacherLink.className = 'nav-item';
                            teacherLink.innerHTML = `
                                <span class="material-symbols-outlined text-accent">school</span>
                                <span>Teacher Dashboard</span>
                            `;
                            nav.insertBefore(teacherLink, nav.children[1]); // Insert after Dashboard
                            highlightActiveLink();
                        }

                        // Add Admin Panel if role is Admin
                        if (profile.role === 'Admin' && !document.querySelector('a[href="feedback-admin.html"]')) {
                            const adminLink = document.createElement('a');
                            adminLink.href = 'feedback-admin.html';
                            adminLink.className = 'nav-item';
                            adminLink.innerHTML = `
                                <span class="material-symbols-outlined text-accent">admin_panel_settings</span>
                                <span>Admin Panel</span>
                            `;
                            nav.appendChild(adminLink);
                            highlightActiveLink();
                        }
                    }
                } catch (error) {
                    console.error('Error updating sidebar profile:', error);
                }
            }
        });
    }
}
