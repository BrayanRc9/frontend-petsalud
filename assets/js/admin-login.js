// Admin login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
});

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Hide any previous errors
    hideError();
    
    // Show loading state
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<span class="loading"></span> Verificando acceso...';
    loginBtn.disabled = true;
    
    try {
        const result = await authenticateUser(email, password, 'admin');
        
        if (result.success) {
            showNotification('¡Acceso autorizado! Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1000);
        } else {
            showError('Credenciales inválidas. Intenta con admin@petsalud.com / 123456');
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