// Veterinarian dashboard functionality
let currentTab = 'appointments';
let patients = [];
let appointments = [];

document.addEventListener('DOMContentLoaded', function() {
    // Require authentication
    const user = requireAuth(['vet']);
    if (!user) return;
    
    // Initialize dashboard
    initializeVetDashboard();
    
    // Load mock data
    loadMockData();
    
    // Show initial tab
    showTab('appointments');
    
    // Update stats
    updateStats();
});

function initializeVetDashboard() {
    // Add event listeners
    const medicalRecordForm = document.getElementById('medicalRecordForm');
    if (medicalRecordForm) {
        medicalRecordForm.addEventListener('submit', handleAddMedicalRecord);
    }
    
    const searchInput = document.getElementById('searchPatients');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchPatients);
    }
    
    // Set today's date as default
    const recordDate = document.getElementById('recordDate');
    if (recordDate) {
        recordDate.value = new Date().toISOString().split('T')[0];
    }
}

function loadMockData() {
    // Mock patients data
    patients = [
        {
            id: '1',
            name: 'Max',
            species: 'Perro',
            breed: 'Golden Retriever',
            age: 3,
            owner: 'Juan Pérez',
            ownerEmail: 'juan@email.com',
            phone: '+1234567890',
            medicalHistory: [
                {
                    id: '1',
                    date: '2024-01-15',
                    veterinarian: 'Dr. María García',
                    diagnosis: 'Revisión general',
                    treatment: 'Vacunación anual',
                    notes: 'Mascota en excelente estado de salud'
                }
            ]
        },
        {
            id: '2',
            name: 'Luna',
            species: 'Gato',
            breed: 'Siamés',
            age: 2,
            owner: 'Ana López',
            ownerEmail: 'ana@email.com',
            phone: '+1234567891',
            medicalHistory: [
                {
                    id: '2',
                    date: '2024-01-10',
                    veterinarian: 'Dr. Carlos López',
                    diagnosis: 'Infección respiratoria leve',
                    treatment: 'Antibióticos por 7 días',
                    notes: 'Seguimiento en 2 semanas'
                }
            ]
        }
    ];
    
    // Mock appointments data
    appointments = [
        {
            id: '1',
            patientId: '1',
            patientName: 'Max',
            ownerName: 'Juan Pérez',
            date: '2024-02-15',
            time: '10:00',
            reason: 'Revisión mensual',
            status: 'scheduled'
        },
        {
            id: '2',
            patientId: '2',
            patientName: 'Luna',
            ownerName: 'Ana López',
            date: '2024-02-15',
            time: '14:30',
            reason: 'Control post-tratamiento',
            status: 'in-progress'
        }
    ];
    
    // Populate patient select
    populatePatientSelect();
    
    // Render initial data
    renderAppointments();
    renderPatients();
}

function updateStats() {
    const todayAppointments = appointments.filter(apt => apt.date === '2024-02-15');
    const totalRecords = patients.reduce((acc, p) => acc + p.medicalHistory.length, 0);
    const inProgressAppointments = appointments.filter(a => a.status === 'in-progress');
    
    document.getElementById('todayAppointments').textContent = todayAppointments.length;
    document.getElementById('totalPatients').textContent = patients.length;
    document.getElementById('totalRecords').textContent = totalRecords;
    document.getElementById('inProgressAppointments').textContent = inProgressAppointments.length;
}

function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to selected tab button
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    currentTab = tabName;
}

function renderAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');
    if (!appointmentsTable) return;
    
    const todayAppointments = appointments.filter(apt => apt.date === '2024-02-15');
    
    appointmentsTable.innerHTML = todayAppointments.map(appointment => `
        <tr>
            <td>${appointment.time}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.ownerName}</td>
            <td>${appointment.reason}</td>
            <td>
                <span class="status-badge status-${appointment.status}">
                    ${getStatusText(appointment.status)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="attendAppointment('${appointment.id}')">
                    Atender
                </button>
                <button class="btn btn-sm btn-secondary" onclick="completeAppointment('${appointment.id}')">
                    Completar
                </button>
            </td>
        </tr>
    `).join('');
}

function renderPatients() {
    const patientsGrid = document.getElementById('patientsGrid');
    if (!patientsGrid) return;
    
    patientsGrid.innerHTML = patients.map(patient => `
        <div class="patient-card">
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div>
                        <h3 class="card-title">${patient.name}</h3>
                        <p class="card-subtitle">${patient.species} - ${patient.breed}</p>
                        <p class="card-subtitle">${patient.age} años</p>
                    </div>
                    <span class="status-badge" style="background: #dbeafe; color: #1e40af;">
                        ID: ${patient.id}
                    </span>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-bottom: 16px;">
                    <h4 style="font-weight: 500; color: #1f2937; margin-bottom: 8px;">Propietario</h4>
                    <p style="color: #6b7280; margin-bottom: 4px;">${patient.owner}</p>
                    <p style="color: #6b7280; margin-bottom: 4px;">${patient.ownerEmail}</p>
                    <p style="color: #6b7280;">${patient.phone}</p>
                </div>
                
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="viewPatientDetails('${patient.id}')">
                        👁️ Ver/Editar
                    </button>
                    <button class="btn btn-secondary" onclick="generatePatientReport('${patient.id}')">
                        📄 PDF
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function populatePatientSelect() {
    const select = document.getElementById('recordPatient');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccionar...</option>' +
        patients.map(patient => `
            <option value="${patient.id}">${patient.name} - ${patient.owner}</option>
        `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'scheduled': 'Programada',
        'in-progress': 'En Progreso',
        'completed': 'Completada'
    };
    return statusMap[status] || status;
}

function attendAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = 'in-progress';
        renderAppointments();
        updateStats();
        showNotification('Cita iniciada', 'success');
    }
}

function completeAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = 'completed';
        renderAppointments();
        updateStats();
        showNotification('Cita completada', 'success');
    }
}

function viewPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    
    alert(`Detalles del paciente ${patient.name}:\n\nEspecie: ${patient.species}\nRaza: ${patient.breed}\nEdad: ${patient.age} años\nPropietario: ${patient.owner}\nTeléfono: ${patient.phone}\n\nHistorial médico: ${patient.medicalHistory.length} registros`);
}

function generatePatientReport(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text('PetSalud - Reporte Médico', 20, 20);
        
        // Patient info
        doc.setFontSize(16);
        doc.text(`Paciente: ${patient.name}`, 20, 40);
        doc.setFontSize(12);
        doc.text(`Especie: ${patient.species}`, 20, 50);
        doc.text(`Raza: ${patient.breed}`, 20, 60);
        doc.text(`Edad: ${patient.age} años`, 20, 70);
        doc.text(`Propietario: ${patient.owner}`, 20, 80);
        doc.text(`Teléfono: ${patient.phone}`, 20, 90);
        
        // Medical history
        doc.setFontSize(14);
        doc.text('Historial Médico:', 20, 110);
        
        let yPosition = 120;
        patient.medicalHistory.forEach((record, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. Fecha: ${record.date}`, 20, yPosition);
            doc.text(`   Veterinario: ${record.veterinarian}`, 20, yPosition + 10);
            doc.text(`   Diagnóstico: ${record.diagnosis}`, 20, yPosition + 20);
            doc.text(`   Tratamiento: ${record.treatment}`, 20, yPosition + 30);
            doc.text(`   Notas: ${record.notes}`, 20, yPosition + 40);
            yPosition += 60;
        });
        
        doc.save(`reporte-medico-${patient.name.toLowerCase()}.pdf`);
        showNotification('Reporte generado exitosamente', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error al generar el reporte', 'error');
    }
}

function handleSearchPatients() {
    const searchTerm = document.getElementById('searchPatients').value.toLowerCase();
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.owner.toLowerCase().includes(searchTerm) ||
        patient.id.includes(searchTerm)
    );
    
    // Re-render with filtered results
    const patientsGrid = document.getElementById('patientsGrid');
    if (!patientsGrid) return;
    
    patientsGrid.innerHTML = filteredPatients.map(patient => `
        <div class="patient-card">
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div>
                        <h3 class="card-title">${patient.name}</h3>
                        <p class="card-subtitle">${patient.species} - ${patient.breed}</p>
                        <p class="card-subtitle">${patient.age} años</p>
                    </div>
                    <span class="status-badge" style="background: #dbeafe; color: #1e40af;">
                        ID: ${patient.id}
                    </span>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-bottom: 16px;">
                    <h4 style="font-weight: 500; color: #1f2937; margin-bottom: 8px;">Propietario</h4>
                    <p style="color: #6b7280; margin-bottom: 4px;">${patient.owner}</p>
                    <p style="color: #6b7280; margin-bottom: 4px;">${patient.ownerEmail}</p>
                    <p style="color: #6b7280;">${patient.phone}</p>
                </div>
                
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="viewPatientDetails('${patient.id}')">
                        👁️ Ver/Editar
                    </button>
                    <button class="btn btn-secondary" onclick="generatePatientReport('${patient.id}')">
                        📄 PDF
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleAddMedicalRecord(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const patientId = formData.get('recordPatient');
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showNotification('Por favor selecciona un paciente', 'error');
        return;
    }
    
    const user = getCurrentUser();
    const newRecord = {
        id: Date.now().toString(),
        date: formData.get('recordDate'),
        veterinarian: user?.name || 'Doctor',
        diagnosis: formData.get('recordDiagnosis'),
        treatment: formData.get('recordTreatment'),
        notes: formData.get('recordNotes') || ''
    };
    
    patient.medicalHistory.push(newRecord);
    updateStats();
    e.target.reset();
    
    // Set today's date again
    document.getElementById('recordDate').value = new Date().toISOString().split('T')[0];
    
    showNotification('Historia clínica agregada exitosamente', 'success');
}

// Reemplazar la función showAddPatientModal existente con esta versión actualizada
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

// Actualizar la función initializeVetDashboard para incluir los nuevos eventos
function initializeVetDashboard() {
    // Add event listeners (código existente)
    const medicalRecordForm = document.getElementById('medicalRecordForm');
    if (medicalRecordForm) {
        medicalRecordForm.addEventListener('submit', handleAddMedicalRecord);
    }
    
    const searchInput = document.getElementById('searchPatients');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchPatients);
    }
    
    // Nuevo: Agregar evento al formulario de nuevo paciente
    const addPatientForm = document.getElementById('addPatientForm');
    if (addPatientForm) {
        addPatientForm.addEventListener('submit', handleAddPatient);
    }
    
    // Nuevo: Agregar validación en tiempo real
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
    
    // Nuevo: Cerrar modal al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('addPatientModal');
        if (event.target === modal) {
            closeAddPatientModal();
        }
    });
    
    // Nuevo: Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAddPatientModal();
        }
    });
    
    // Set today's date as default (código existente)
    const recordDate = document.getElementById('recordDate');
    if (recordDate) {
        recordDate.value = new Date().toISOString().split('T')[0];
    }
}

function showAddRecordModal() {
    showTab('records');
}