document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const nameField = document.getElementById('name-field');
    const submitBtn = document.getElementById('submit-btn');
    const authForm = document.getElementById('auth-form');

    let isLogin = true;

    loginTab.addEventListener('click', () => {
        isLogin = true;
        loginTab.style.color = 'var(--lib-blue)';
        loginTab.style.borderBottom = '3px solid var(--lib-blue)';
        registerTab.style.color = '#ccc';
        registerTab.style.borderBottom = 'none';
        nameField.style.display = 'none';
        submitBtn.textContent = 'Sign In';
    });

    registerTab.addEventListener('click', () => {
        isLogin = false;
        registerTab.style.color = 'var(--lib-blue)';
        registerTab.style.borderBottom = '3px solid var(--lib-blue)';
        loginTab.style.color = '#ccc';
        loginTab.style.borderBottom = 'none';
        nameField.style.display = 'block';
        submitBtn.textContent = 'Create Account';
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('full-name').value;

        if (isLogin) {
            // Simple mock login
            localStorage.setItem('gentsacademy_session', JSON.stringify({ email, name: name || email.split('@')[0] }));
            window.location.href = 'dashboard.html';
        } else {
            // Simple mock register
            localStorage.setItem('gentsacademy_session', JSON.stringify({ email, name }));
            alert('Account created successfully!');
            window.location.href = 'dashboard.html';
        }
    });
});
