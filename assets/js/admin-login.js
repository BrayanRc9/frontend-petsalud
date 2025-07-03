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

function showNotification(message, type = 'info') {
    let color = 'blue';
    if (type === 'success') color = 'green';
    else if (type === 'error') color = 'red';

    const div = document.createElement('div');
    div.textContent = message;
    div.style.position = 'fixed';
    div.style.top = '20px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.backgroundColor = color;
    div.style.color = 'white';
    div.style.padding = '10px 20px';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    div.style.zIndex = '1000';
    document.body.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 3000);
}