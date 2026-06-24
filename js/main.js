/* ===========================
   MAIN APPLICATION SCRIPT
   Landing Page Functionality
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

/**
 * Initialize landing page
 */
function initializePage() {
    console.log(`${APP_CONFIG.appName} v${APP_CONFIG.appVersion} initialized`);
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize course card interactions
    initCourseCards();
    
    // Initialize button interactions
    initButtons();
    
    // Check if user is logged in
    checkAuthStatus();
}

/**
 * Initialize smooth scroll behavior
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize course card hover effects and animations
 */
function initCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach((card, index) => {
        // Stagger animation on page load
        card.style.animation = `fadeIn 0.6s ease-out ${index * 0.1}s backwards`;
        
        // Add interactive class on hover
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease-in-out';
        });
    });
}

/**
 * Initialize button interactions
 */
function initButtons() {
    // Explore button - redirect to courses page
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's an internal link, handle navigation
            if (href && !href.startsWith('http')) {
                // Let the default behavior handle it
                return;
            }
        });
    });
}

/**
 * Check authentication status on landing page
 */
function checkAuthStatus() {
    try {
        const session = localStorage.getItem('gentsacademy_session');
        if (session) {
            const user = JSON.parse(session);
            console.log(`User logged in: ${user.email}`);
            
            // Could update navbar to show user profile, etc.
            updateNavbarForLoggedInUser(user);
        }
    } catch (error) {
        console.log('No active session found');
    }
}

/**
 * Update navbar for logged-in users
 */
function updateNavbarForLoggedInUser(user) {
    const navMenu = document.querySelector('.navbar-menu');
    
    if (!navMenu) return;
    
    // Find and update login/signup buttons
    const loginBtn = navMenu.querySelector('.btn-login');
    const signupBtn = navMenu.querySelector('.btn-signup');
    
    if (loginBtn && signupBtn) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.href = 'dashboard.html';
        
        signupBtn.textContent = 'Logout';
        signupBtn.href = '#';
        signupBtn.onclick = logout;
    }
}

/**
 * Handle logout
 */
function logout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('gentsacademy_session');
        localStorage.removeItem('gentsacademy_user');
        window.location.href = 'index.html';
    }
}

/**
 * Utility: Get current user from localStorage
 */
function getCurrentUser() {
    try {
        const session = localStorage.getItem('gentsacademy_session');
        if (session) {
            return JSON.parse(session);
        }
    } catch (error) {
        console.error('Error parsing session:', error);
    }
    return null;
}

/**
 * Utility: Check if user is authenticated
 */
function isUserAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Utility: Store session
 */
function storeSession(user) {
    localStorage.setItem('gentsacademy_session', JSON.stringify(user));
}

/**
 * Utility: Clear session
 */
function clearSession() {
    localStorage.removeItem('gentsacademy_session');
    localStorage.removeItem('gentsacademy_user');
}

/**
 * Utility: Format date
 */
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Utility: Show notification (toast-like message)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
        border-left: 4px solid var(--gold);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentUser,
        isUserAuthenticated,
        storeSession,
        clearSession,
        formatDate,
        showNotification,
        debounce,
        throttle
    };
}
