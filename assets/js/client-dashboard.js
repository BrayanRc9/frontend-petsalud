// Client dashboard functionality
let currentTab = 'pets';
let pets = [];
let appointments = [];

document.addEventListener('DOMContentLoaded', function() {
    // Require authentication
    const user = requireAuth(['client']);
    if (!user) return;
    
    // Initialize dashboard
    initializeClientDashboard();
    
    // Load mock data
    loadMockData();
    
    // Show initial tab
    showTab('pets');
});

function initializeClientDashboard() {
    // Add event listeners
    const addPetForm = document.getElementById('addPetForm');
    if (addPetForm) {
        addPetForm.addEventListener('submit', handleAddPet);
    }
    
    const searchInput = document.getElementById('searchRecords');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchRecords);
    }
}

function loadMockData() {
    // Mock pets data
    pets = [
        {
            id: '1',
            name: 'Max',
            species: 'Perro',
            breed: 'Golden Retriever',
            age: 3,
            photo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300',
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
            photo: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300',
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
            petId: '1',
            petName: 'Max',
            date: '2024-02-15',
            time: '10:00',
            veterinarian: 'Dr. María García',
            reason: 'Revisión mensual',
            status: 'scheduled'
        },
        {
            id: '2',
            petId: '2',
            petName: 'Luna',
            date: '2024-02-20',
            time: '14:30',
            veterinarian: 'Dr. Carlos López',
            reason: 'Control post-tratamiento',
            status: 'scheduled'
        }
    ];
    
    // Render initial data
    renderPets();
    renderAppointments();
    renderMedicalRecords();
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

function renderPets() {
    const petsGrid = document.getElementById('petsGrid');
    if (!petsGrid) return;
    
    petsGrid.innerHTML = pets.map(pet => `
        <div class="pet-card">
            <div class="card-image">
                ${pet.photo ? 
                    `<img src="${pet.photo}" alt="${pet.name}">` : 
                    '<span style="font-size: 48px;">📷</span>'
                }
            </div>
            <div class="card-content">
                <h3 class="card-title">${pet.name}</h3>
                <p class="card-subtitle">${pet.species} - ${pet.breed}</p>
                <p class="card-subtitle">${pet.age} años</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="viewPetDetails('${pet.id}')">
                        Ver Detalles
                    </button>
                    <button class="btn btn-secondary" onclick="generatePetPDF('${pet.id}')">
                        📄 PDF
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');
    if (!appointmentsTable) return;
    
    appointmentsTable.innerHTML = appointments.map(appointment => `
        <tr>
            <td>${appointment.petName}</td>
            <td>${appointment.date} - ${appointment.time}</td>
            <td>${appointment.veterinarian}</td>
            <td>${appointment.reason}</td>
            <td>
                <span class="status-badge status-${appointment.status}">
                    ${getStatusText(appointment.status)}
                </span>
            </td>
        </tr>
    `).join('');
}

function renderMedicalRecords() {
    const recordsGrid = document.getElementById('recordsGrid');
    if (!recordsGrid) return;
    
    recordsGrid.innerHTML = pets.map(pet => `
        <div class="record-card">
            <div class="card-content">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
                        ${pet.photo ? 
                            `<img src="${pet.photo}" alt="${pet.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                            '<span style="font-size: 24px;">❤️</span>'
                        }
                    </div>
                    <div>
                        <h3 class="card-title">${pet.name}</h3>
                        <p class="card-subtitle">ID: ${pet.id}</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    ${pet.medicalHistory.map(record => `
                        <div style="border-left: 4px solid #14b8a6; padding-left: 16px; margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <strong>${record.diagnosis}</strong>
                                <span style="color: #6b7280; font-size: 14px;">${record.date}</span>
                            </div>
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">Dr. ${record.veterinarian}</p>
                            <p style="color: #6b7280; font-size: 14px;">${record.treatment}</p>
                        </div>
                    `).join('')}
                </div>
                
                <button class="btn btn-primary btn-full" onclick="generatePetPDF('${pet.id}')">
                    📄 Descargar Historia Clínica
                </button>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'scheduled': 'Programada',
        'completed': 'Completada',
        'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
}

function viewPetDetails(petId) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    
    alert(`Detalles de ${pet.name}:\n\nEspecie: ${pet.species}\nRaza: ${pet.breed}\nEdad: ${pet.age} años\n\nHistorial médico: ${pet.medicalHistory.length} registros`);
}

function generatePetPDF(petId) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    
    const user = getCurrentUser();
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text('PetSalud - Historia Clínica', 20, 20);
        
        // Pet info
        doc.setFontSize(16);
        doc.text(`Mascota: ${pet.name}`, 20, 40);
        doc.setFontSize(12);
        doc.text(`Especie: ${pet.species}`, 20, 50);
        doc.text(`Raza: ${pet.breed}`, 20, 60);
        doc.text(`Edad: ${pet.age} años`, 20, 70);
        doc.text(`Propietario: ${user?.name || 'Cliente'}`, 20, 80);
        
        // Medical history
        doc.setFontSize(14);
        doc.text('Historial Médico:', 20, 100);
        
        let yPosition = 110;
        pet.medicalHistory.forEach((record, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. Fecha: ${record.date}`, 20, yPosition);
            doc.text(`   Veterinario: ${record.veterinarian}`, 20, yPosition + 10);
            doc.text(`   Diagnóstico: ${record.diagnosis}`, 20, yPosition + 20);
            doc.text(`   Tratamiento: ${record.treatment}`, 20, yPosition + 30);
            doc.text(`   Notas: ${record.notes}`, 20, yPosition + 40);
            yPosition += 60;
        });
        
        doc.save(`historia-clinica-${pet.name.toLowerCase()}.pdf`);
        showNotification('PDF generado exitosamente', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error al generar el PDF', 'error');
    }
}

function showAddPetModal() {
    const modal = document.getElementById('addPetModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleAddPet(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newPet = {
        id: Date.now().toString(),
        name: formData.get('petName'),
        species: formData.get('petSpecies'),
        breed: formData.get('petBreed'),
        age: parseInt(formData.get('petAge')),
        photo: null, // In a real app, you'd handle file upload here
        medicalHistory: []
    };
    
    pets.push(newPet);
    renderPets();
    closeModal('addPetModal');
    e.target.reset();
    
    showNotification('Mascota agregada exitosamente', 'success');
}

function handleSearchRecords() {
    const searchTerm = document.getElementById('searchRecords').value.toLowerCase();
    const filteredPets = pets.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm) ||
        pet.id.includes(searchTerm)
    );
    
    // Re-render with filtered results
    const recordsGrid = document.getElementById('recordsGrid');
    if (!recordsGrid) return;
    
    recordsGrid.innerHTML = filteredPets.map(pet => `
        <div class="record-card">
            <div class="card-content">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
                        ${pet.photo ? 
                            `<img src="${pet.photo}" alt="${pet.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                            '<span style="font-size: 24px;">❤️</span>'
                        }
                    </div>
                    <div>
                        <h3 class="card-title">${pet.name}</h3>
                        <p class="card-subtitle">ID: ${pet.id}</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    ${pet.medicalHistory.map(record => `
                        <div style="border-left: 4px solid #14b8a6; padding-left: 16px; margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <strong>${record.diagnosis}</strong>
                                <span style="color: #6b7280; font-size: 14px;">${record.date}</span>
                            </div>
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">Dr. ${record.veterinarian}</p>
                            <p style="color: #6b7280; font-size: 14px;">${record.treatment}</p>
                        </div>
                    `).join('')}
                </div>
                
                <button class="btn btn-primary btn-full" onclick="generatePetPDF('${pet.id}')">
                    📄 Descargar Historia Clínica
                </button>
            </div>
        </div>
    `).join('');
}

function searchRecords() {
    handleSearchRecords();
}

function showScheduleModal() {
    alert('Funcionalidad de agendar cita en desarrollo');
}