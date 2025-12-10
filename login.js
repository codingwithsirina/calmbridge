document.getElementById('loginForm').addEventListener('input', function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');

    // Identifiants simples pour la démo
    const validEmail = "test@test.com";
    const validPassword = "1234";

    if (email === validEmail && password === validPassword) {
        successSound.play();
        localStorage.setItem('childSession', 'active');
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 500);
    } else if (email.length > 0 && password.length > 0) {
        errorMessage.textContent = "Email ou mot de passe invalide.";
        errorSound.play();
    } else {
        errorMessage.textContent = "";
    }
    document.getElementById('loginForm').addEventListener('input', function() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    const validEmail = "test@test.com";
    const validPassword = "1234";

    if (email === validEmail && password === validPassword) {
        localStorage.setItem('childSession', 'active');
        localStorage.setItem('childName', username); // Stocker le nom
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 500);
    } else if (email.length > 0 && password.length > 0) {
        errorMessage.textContent = "Email ou mot de passe invalide.";
    } else {
        errorMessage.textContent = "";
    }
});
});
