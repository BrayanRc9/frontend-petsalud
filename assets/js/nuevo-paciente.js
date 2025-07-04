// Función para mostrar el modal de nuevo paciente
function showAddPatientModal() {
    const modal = document.getElementById('addPatientModal');
    if (modal) {
        modal.style.display = 'block';
        // Resetear formulario
        const form = document.getElementById('addPatientForm');
        if (form) {
            form.reset();
        }
    }
}

// Función para cerrar el modal
function closeAddPatientModal() {
    const modal = document.getElementById('addPatientModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para manejar el envío del formulario de nuevo paciente
function handleAddPatient(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Validar campos requeridos
    const requiredFields = ['patientName', 'species', 'breed', 'age', 'ownerName', 'ownerEmail', 'ownerPhone'];
    let isValid = true;
    
    for (let field of requiredFields) {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            showNotification(`El campo ${getFieldLabel(field)} es requerido`, 'error');
            isValid = false;
            break;
        }
    }
    
    if (!isValid) return;
    
    // Validar email
    const email = formData.get('ownerEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Validar edad
    const age = parseInt(formData.get('age'));
    if (isNaN(age) || age < 0 || age > 30) {
        showNotification('Por favor ingresa una edad válida (0-30 años)', 'error');
        return;
    }
    
    // Crear nuevo paciente
    const newPatient = {
        id: (patients.length + 1).toString(),
        name: formData.get('patientName').trim(),
        species: formData.get('species'),
        breed: formData.get('breed').trim(),
        age: age,
        owner: formData.get('ownerName').trim(),
        ownerEmail: email.trim().toLowerCase(),
        phone: formData.get('ownerPhone').trim(),
        medicalHistory: [],
        registrationDate: new Date().toISOString().split('T')[0],
        notes: formData.get('notes')?.trim() || ''
    };
    
    // Verificar que no exista otro paciente con el mismo nombre y propietario
    const existingPatient = patients.find(p => 
        p.name.toLowerCase() === newPatient.name.toLowerCase() && 
        p.owner.toLowerCase() === newPatient.owner.toLowerCase()
    );
    
    if (existingPatient) {
        showNotification('Ya existe un paciente con ese nombre y propietario', 'error');
        return;
    }
    
    // Agregar el nuevo paciente
    patients.push(newPatient);
    
    // Actualizar la interfaz
    renderPatients();
    populatePatientSelect();
    updateStats();
    
    // Cerrar modal y mostrar mensaje de éxito
    closeAddPatientModal();
    showNotification(`Paciente ${newPatient.name} agregado exitosamente`, 'success');
    
    // Opcional: cambiar a la pestaña de pacientes para ver el nuevo paciente
    showTab('patients');
}

// Función auxiliar para obtener etiquetas de campos
function getFieldLabel(fieldName) {
    const labels = {
        'patientName': 'Nombre del Paciente',
        'species': 'Especie',
        'breed': 'Raza',
        'age': 'Edad',
        'ownerName': 'Nombre del Propietario',
        'ownerEmail': 'Email del Propietario',
        'ownerPhone': 'Teléfono del Propietario'
    };
    return labels[fieldName] || fieldName;
}

// Función para validar teléfono en tiempo real
function validatePhoneInput(input) {
    // Permitir solo números, espacios, guiones y el símbolo +
    let value = input.value.replace(/[^\d\s\-\+]/g, '');
    
    // Limitar longitud
    if (value.length > 15) {
        value = value.substring(0, 15);
    }
    
    input.value = value;
}

// Función para validar edad en tiempo real
function validateAgeInput(input) {
    let value = parseInt(input.value);
    
    if (isNaN(value) || value < 0) {
        input.value = '';
    } else if (value > 30) {
        input.value = '30';
    }
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const modal = document.getElementById('addPatientModal');
    if (event.target === modal) {
        closeAddPatientModal();
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAddPatientModal();
    }
});

// Inicializar eventos del formulario cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    const addPatientForm = document.getElementById('addPatientForm');
    if (addPatientForm) {
        addPatientForm.addEventListener('submit', handleAddPatient);
    }
    
    // Agregar validación en tiempo real a los campos
    const phoneInput = document.getElementById('ownerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            validatePhoneInput(this);
        });
    }
    
    const ageInput = document.getElementById('age');
    if (ageInput) {
        ageInput.addEventListener('input', function() {
            validateAgeInput(this);
        });
    }
});