// Check if user is already logged in
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
    window.location.href = 'index.html';
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');

        try {
            const data = await API.login(email, password);
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'index.html';
        } catch (error) {
            errorMsg.textContent = error.message;
        }
    });
}

// Register
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');

        try {
            const data = await API.register(username, email, password);
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'index.html';
        } catch (error) {
            errorMsg.textContent = error.message;
        }
    });
}
