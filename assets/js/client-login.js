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
    
    hideError();
    
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