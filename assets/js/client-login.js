// Client login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('clientLoginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleClientLogin);
    }
});

async function handleClientLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Hide any previous errors
    hideError();
    
    // Show loading state
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<span class="loading"></span> Iniciando sesión...';
    loginBtn.disabled = true;
    
    try {
        const result = await authenticateUser(email, password, 'client');
        
        if (result.success) {
            showNotification('¡Bienvenido! Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = 'client-dashboard.html';
            }, 1000);
        } else {
            showError('Credenciales inválidas. Intenta con client@petsalud.com / 123456');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
        // Reset button
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}