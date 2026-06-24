/* ===========================
   AUTHENTICATION PAGE FUNCTIONALITY
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
});

/**
 * Initialize auth page
 */
function initializeAuthPage() {
    // Check if already logged in
    if (isUserAuthenticated()) {
        // Redirect to dashboard or courses
        const redirect = sessionStorage.getItem('redirectAfterLogin') || 'dashboard.html';
        window.location.href = redirect;
        return;
    }
    
    // Set up tab switching
    setupTabSwitching();
    
    // Set up form submissions
    setupFormSubmissions();
}

/**
 * Set up tab switching
 */
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
}

/**
 * Switch between login and register tabs
 */
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Update toggle text
    const toggleText = document.getElementById('toggleText');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (tabName === 'login') {
        toggleText.textContent = "Don't have an account?";
        toggleBtn.textContent = 'Register here';
    } else {
        toggleText.textContent = 'Already have an account?';
        toggleBtn.textContent = 'Login here';
    }
}

/**
 * Toggle auth tab
 */
function toggleAuthTab(e) {
    e.preventDefault();
    const currentTab = document.querySelector('.tab-btn.active').dataset.tab;
    const newTab = currentTab === 'login' ? 'register' : 'login';
    switchTab(newTab);
}

/**
 * Set up form submissions
 */
function setupFormSubmissions() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

/**
 * Handle login
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate inputs
    if (!validateEmail(email)) {
        showFormError('loginEmail', 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showFormError('loginPassword', 'Password must be at least 6 characters');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span>Signing in...';
    
    try {
        // Simulate authentication (in production, use Supabase)
        // For demo purposes, we'll create a simple user session
        await simulateLogin(email, password);
        
        // Store session
        const user = {
            id: generateId(),
            email: email,
            fullName: email.split('@')[0],
            createdAt: new Date().toISOString()
        };
        
        storeSession(user);
        
        showNotification('Welcome back! Redirecting...', 'success');
        
        // Redirect
        setTimeout(() => {
            const redirect = sessionStorage.getItem('redirectAfterLogin') || 'dashboard.html';
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirect;
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        showFormError('loginPassword', 'Invalid email or password');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Handle registration
 */
async function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validate inputs
    let hasError = false;
    
    if (fullName.length < 2) {
        showFormError('registerName', 'Please enter your full name');
        hasError = true;
    }
    
    if (!validateEmail(email)) {
        showFormError('registerEmail', 'Please enter a valid email address');
        hasError = true;
    }
    
    if (password.length < 8) {
        showFormError('registerPassword', 'Password must be at least 8 characters');
        hasError = true;
    }
    
    if (password !== confirmPassword) {
        showFormError('registerConfirmPassword', 'Passwords do not match');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Check if email already registered (simple check)
    if (isEmailRegistered(email)) {
        showFormError('registerEmail', 'This email is already registered');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span>Creating account...';
    
    try {
        // Simulate account creation (in production, use Supabase)
        await simulateRegister(email, password);
        
        // Store user registration
        const user = {
            id: generateId(),
            email: email,
            fullName: fullName,
            createdAt: new Date().toISOString()
        };
        
        storeSession(user);
        
        // Store registered users (for demo)
        let registeredUsers = JSON.parse(localStorage.getItem('gentsacademy_registered_users')) || [];
        registeredUsers.push({ email, password, fullName });
        localStorage.setItem('gentsacademy_registered_users', JSON.stringify(registeredUsers));
        
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Redirect
        setTimeout(() => {
            const redirect = sessionStorage.getItem('redirectAfterLogin') || 'dashboard.html';
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirect;
        }, 1500);
        
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Error creating account. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if email is already registered
 */
function isEmailRegistered(email) {
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('gentsacademy_registered_users')) || [];
        return registeredUsers.some(user => user.email === email);
    } catch {
        return false;
    }
}

/**
 * Simulate login (replace with Supabase in production)
 */
function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Check registered users
            const registeredUsers = JSON.parse(localStorage.getItem('gentsacademy_registered_users')) || [];
            const user = registeredUsers.find(u => u.email === email && u.password === password);
            
            if (user) {
                resolve(user);
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 800);
    });
}

/**
 * Simulate registration (replace with Supabase in production)
 */
function simulateRegister(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ email, password });
        }, 800);
    });
}

/**
 * Show form error
 */
function showFormError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = input.nextElementSibling;
    
    if (errorEl && errorEl.classList.contains('form-error')) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
        input.focus();
    }
}

/**
 * Clear form errors on input
 */
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('form-input')) {
        const errorEl = e.target.nextElementSibling;
        if (errorEl && errorEl.classList.contains('form-error')) {
            errorEl.classList.remove('show');
            errorEl.textContent = '';
        }
    }
});

/**
 * Generate unique ID
 */
function generateId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
