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

function showAddPatientModal() {
    alert('Funcionalidad de agregar paciente en desarrollo');
}

function showAddRecordModal() {
    showTab('records');
}