function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

const AUTH_CONFIG = {
    users: {
        'client@petsalud.com': {
            id: '1',
            name: 'Prueba Usuario',
            email: 'client@petsalud.com',
            role: 'client',
            password: '123456'
        },
        'vet@petsalud.com': {
            id: '2',
            name: 'Prueba Veterinario',
            email: 'vet@petsalud.com',
            role: 'vet',
            password: '123456'
        },
        'admin@petsalud.com': {
            id: '3',
            name: 'Admin PetSalud',
            email: 'admin@petsalud.com',
            role: 'admin',
            password: '123456'
        }
    }
};

async function authenticateUser(email, password, expectedRole) {
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = AUTH_CONFIG.users[email];
    
    if (user && user.password === password && user.role === expectedRole) {
       
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Credenciales inválidas' };
}

function logout() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        window.location.href = 'index.html';
        return null;
    }
    
    return user;
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

function showError(message, elementId = 'errorMessage') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(elementId = 'errorMessage') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
   
    const userNameElements = document.querySelectorAll('#userName, #userNameTitle');
    if (user && userNameElements.length > 0) {
        userNameElements.forEach(element => {
            element.textContent = user.name;
        });
    }
});