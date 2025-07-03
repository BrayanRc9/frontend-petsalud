
document.addEventListener('DOMContentLoaded', function() {
    
    initializeApp();
});

function initializeApp() {
    
    checkAuthStatus();
    
    
    addSmoothScrolling();
    
    
    addButtonLoadingStates();
    
    
    initializeAnimations();
}

function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentUser && (currentPage.includes('login') || currentPage === 'index.html' || currentPage === '')) {
        redirectToDashboard(currentUser.role);
    }
    
    if (!currentUser && currentPage.includes('dashboard')) {
        window.location.href = 'index.html';
    }
}

function redirectToDashboard(role) {
    const dashboards = {
        'client': 'client-dashboard.html',
        'vet': 'vet-dashboard.html',
        'admin': 'admin-dashboard.html'
    };
    
    if (dashboards[role]) {
        window.location.href = dashboards[role];
    }
}

function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addButtonLoadingStates() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit' || this.classList.contains('loading-btn')) {
                showButtonLoading(this);
            }
        });
    });
}

function showButtonLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Cargando...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 3000);
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .pet-card, .patient-card');
    animatedElements.forEach(el => observer.observe(el));
}

function getCurrentUser() {
    const userStr = localStorage.getItem('petsalud_user');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('petsalud_user', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('petsalud_user');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

window.addEventListener('error', function(e) {
    console.error('Error:', e.error);
    showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('Ha ocurrido un error inesperado.', 'error');
});