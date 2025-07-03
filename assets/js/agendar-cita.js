// Funcionalidad para agendar citas
let veterinarios = [];
let citasAgendadas = [];

// Inicializar datos de veterinarios (mock data)
function initializeVeterinarios() {
    veterinarios = [
        {
            id: '1',
            name: 'Dr. María García',
            specialty: 'Medicina General',
            schedule: {
                lunes: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
                martes: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
                miércoles: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
                jueves: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
                viernes: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
                sábado: ['09:00', '10:00', '11:00'],
                domingo: []
            }
        },
        {
            id: '2',
            name: 'Dr. Carlos López',
            specialty: 'Cirugía Veterinaria',
            schedule: {
                lunes: ['08:00', '09:00', '10:00', '15:00', '16:00', '17:00'],
                martes: ['08:00', '09:00', '10:00', '15:00', '16:00', '17:00'],
                miércoles: ['08:00', '09:00', '10:00', '15:00', '16:00', '17:00'],
                jueves: ['08:00', '09:00', '10:00', '15:00', '16:00', '17:00'],
                viernes: ['08:00', '09:00', '10:00', '15:00', '16:00', '17:00'],
                sábado: ['08:00', '09:00', '10:00'],
                domingo: []
            }
        },
        {
            id: '3',
            name: 'Dr. Ana Rodríguez',
            specialty: 'Dermatología Veterinaria',
            schedule: {
                lunes: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
                martes: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
                miércoles: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
                jueves: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
                viernes: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
                sábado: [],
                domingo: []
            }
        }
    ];
}

// Función para mostrar el modal de agendar cita
function showScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.classList.add('active');
        loadMascotasEnSelect();
        loadVeterinariosEnSelect();
        setupDateTimeValidation();
    }
}

// Cargar mascotas en el select
function loadMascotasEnSelect() {
    const mascotaSelect = document.getElementById('mascotaCita');
    if (mascotaSelect && pets.length > 0) {
        mascotaSelect.innerHTML = '<option value="">Selecciona una mascota</option>';
        pets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = `${pet.name} - ${pet.species}`;
            mascotaSelect.appendChild(option);
        });
    } else if (mascotaSelect) {
        mascotaSelect.innerHTML = '<option value="">No hay mascotas registradas</option>';
    }
}

// Cargar veterinarios en el select
function loadVeterinariosEnSelect() {
    const veterinarioSelect = document.getElementById('veterinarioCita');
    if (veterinarioSelect) {
        veterinarioSelect.innerHTML = '<option value="">Selecciona un veterinario</option>';
        veterinarios.forEach(vet => {
            const option = document.createElement('option');
            option.value = vet.id;
            option.textContent = `${vet.name} - ${vet.specialty}`;
            veterinarioSelect.appendChild(option);
        });
    }
}

// Configurar validación de fecha y hora
function setupDateTimeValidation() {
    const fechaCitaInput = document.getElementById('fechaCita');
    const veterinarioSelect = document.getElementById('veterinarioCita');
    
    if (fechaCitaInput) {
        // Establecer fecha mínima (hoy)
        const today = new Date();
        const minDate = today.toISOString().slice(0, 16);
        fechaCitaInput.min = minDate;
        
        // Establecer fecha máxima (3 meses desde hoy)
        const maxDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
        fechaCitaInput.max = maxDate.toISOString().slice(0, 16);
        
        // Validar disponibilidad cuando cambie la fecha o veterinario
        fechaCitaInput.addEventListener('change', validateAvailability);
        veterinarioSelect.addEventListener('change', validateAvailability);
    }
}

// Validar disponibilidad del veterinario
function validateAvailability() {
    const fechaCitaInput = document.getElementById('fechaCita');
    const veterinarioSelect = document.getElementById('veterinarioCita');
    const messageDiv = document.getElementById('availabilityMessage') || createAvailabilityMessage();
    
    if (!fechaCitaInput.value || !veterinarioSelect.value) {
        messageDiv.textContent = '';
        messageDiv.className = 'availability-message';
        return;
    }
    
    const selectedDate = new Date(fechaCitaInput.value);
    const veterinario = veterinarios.find(v => v.id === veterinarioSelect.value);
    
    if (!veterinario) {
        messageDiv.textContent = 'Veterinario no encontrado';
        messageDiv.className = 'availability-message error';
        return;
    }
    
    const dayName = getDayName(selectedDate.getDay());
    const timeSlots = veterinario.schedule[dayName] || [];
    const selectedTime = fechaCitaInput.value.split('T')[1];
    
    // Verificar si el veterinario trabaja ese día
    if (timeSlots.length === 0) {
        messageDiv.textContent = `${veterinario.name} no atiende los ${dayName}s`;
        messageDiv.className = 'availability-message error';
        return;
    }
    
    // Verificar si la hora está disponible
    const isTimeAvailable = timeSlots.some(slot => slot === selectedTime);
    
    if (!isTimeAvailable) {
        messageDiv.textContent = `Hora no disponible. Horarios disponibles: ${timeSlots.join(', ')}`;
        messageDiv.className = 'availability-message error';
        return;
    }
    
    // Verificar si ya hay una cita agendada
    const isSlotTaken = appointments.some(apt => 
        apt.veterinarian === veterinario.name && 
        apt.date === selectedDate.toISOString().split('T')[0] &&
        apt.time === selectedTime
    );
    
    if (isSlotTaken) {
        messageDiv.textContent = 'Este horario ya está ocupado';
        messageDiv.className = 'availability-message error';
        return;
    }
    
    messageDiv.textContent = '✓ Horario disponible';
    messageDiv.className = 'availability-message success';
}

// Crear elemento para mostrar mensajes de disponibilidad
function createAvailabilityMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'availabilityMessage';
    messageDiv.className = 'availability-message';
    
    const fechaCitaInput = document.getElementById('fechaCita');
    if (fechaCitaInput && fechaCitaInput.parentNode) {
        fechaCitaInput.parentNode.insertBefore(messageDiv, fechaCitaInput.nextSibling);
    }
    
    return messageDiv;
}

// Obtener nombre del día
function getDayName(dayIndex) {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[dayIndex];
}

// Manejar el envío del formulario de agendar cita
function handleAgendarCita(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const fechaCompleta = new Date(document.getElementById('fechaCita').value);
    const mascotaId = document.getElementById('mascotaCita').value;
    const veterinarioId = document.getElementById('veterinarioCita').value;
    const motivo = document.getElementById('motivoCita').value;
    
    // Validaciones
    if (!mascotaId) {
        showNotification('Por favor selecciona una mascota', 'error');
        return;
    }
    
    if (!veterinarioId) {
        showNotification('Por favor selecciona un veterinario', 'error');
        return;
    }
    
    if (!motivo.trim()) {
        showNotification('Por favor ingresa el motivo de la consulta', 'error');
        return;
    }
    
    // Obtener datos
    const mascota = pets.find(p => p.id === mascotaId);
    const veterinario = veterinarios.find(v => v.id === veterinarioId);
    
    if (!mascota || !veterinario) {
        showNotification('Error al encontrar los datos seleccionados', 'error');
        return;
    }
    
    // Crear nueva cita
    const nuevaCita = {
        id: Date.now().toString(),
        petId: mascota.id,
        petName: mascota.name,
        date: fechaCompleta.toISOString().split('T')[0],
        time: fechaCompleta.toTimeString().split(' ')[0].substring(0, 5),
        veterinarian: veterinario.name,
        reason: motivo,
        status: 'scheduled'
    };
    
    // Agregar a la lista de citas
    appointments.push(nuevaCita);
    
    // Actualizar la vista
    renderAppointments();
    
    // Cerrar modal y resetear formulario
    closeModal('scheduleModal');
    e.target.reset();
    
    // Mostrar notificación de éxito
    showNotification('Cita agendada exitosamente', 'success');
    
    // Enviar email de confirmación (simulado)
    sendConfirmationEmail(nuevaCita, mascota, veterinario);
}

// Simular envío de email de confirmación
function sendConfirmationEmail(cita, mascota, veterinario) {
    console.log('Enviando email de confirmación...');
    console.log('Detalles de la cita:', {
        mascota: mascota.name,
        veterinario: veterinario.name,
        fecha: cita.date,
        hora: cita.time,
        motivo: cita.reason
    });
    
    // Aquí se integraría con un servicio de email real
    setTimeout(() => {
        showNotification('Email de confirmación enviado', 'info');
    }, 2000);
}

// Función para cancelar una cita
function cancelAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;
    
    const confirmCancel = confirm(`¿Estás seguro de que quieres cancelar la cita de ${appointment.petName} el ${appointment.date} a las ${appointment.time}?`);
    
    if (confirmCancel) {
        appointment.status = 'cancelled';
        renderAppointments();
        showNotification('Cita cancelada exitosamente', 'success');
    }
}

// Función para reprogramar una cita
function rescheduleAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;
    
    // Llenar el formulario con los datos actuales
    document.getElementById('mascotaCita').value = appointment.petId;
    document.getElementById('motivoCita').value = appointment.reason;
    
    // Buscar el veterinario
    const veterinario = veterinarios.find(v => v.name === appointment.veterinarian);
    if (veterinario) {
        document.getElementById('veterinarioCita').value = veterinario.id;
    }
    
    // Eliminar la cita actual
    const index = appointments.findIndex(apt => apt.id === appointmentId);
    if (index > -1) {
        appointments.splice(index, 1);
    }
    
    // Mostrar modal
    showScheduleModal();
    showNotification('Reprogramando cita. Selecciona la nueva fecha y hora', 'info');
}

// Función para mostrar detalles de una cita
function showAppointmentDetails(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;
    
    const mascota = pets.find(p => p.id === appointment.petId);
    const veterinario = veterinarios.find(v => v.name === appointment.veterinarian);
    
    let details = `Detalles de la Cita\n\n`;
    details += `Mascota: ${appointment.petName}\n`;
    details += `Fecha: ${appointment.date}\n`;
    details += `Hora: ${appointment.time}\n`;
    details += `Veterinario: ${appointment.veterinarian}\n`;
    details += `Motivo: ${appointment.reason}\n`;
    details += `Estado: ${getStatusText(appointment.status)}\n`;
    
    if (mascota) {
        details += `\nDetalles de la Mascota:\n`;
        details += `Especie: ${mascota.species}\n`;
        details += `Raza: ${mascota.breed}\n`;
        details += `Edad: ${mascota.age} años\n`;
    }
    
    if (veterinario) {
        details += `\nEspecialidad: ${veterinario.specialty}\n`;
    }
    
    alert(details);
}

// Inicializar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeVeterinarios();
    
    // Agregar event listener al formulario de agendar cita
    const formAgendarCita = document.getElementById('formAgendarCita');
    if (formAgendarCita) {
        formAgendarCita.addEventListener('submit', handleAgendarCita);
    }
});

// Función para obtener citas del día
function getTodaysAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today && apt.status === 'scheduled');
}

// Función para obtener próximas citas
function getUpcomingAppointments() {
    const today = new Date();
    return appointments.filter(apt => {
        const appointmentDate = new Date(apt.date);
        return appointmentDate > today && apt.status === 'scheduled';
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Función para mostrar recordatorios
function showReminders() {
    const todayAppointments = getTodaysAppointments();
    const upcomingAppointments = getUpcomingAppointments().slice(0, 3);
    
    if (todayAppointments.length > 0) {
        showNotification(`Tienes ${todayAppointments.length} cita(s) hoy`, 'info');
    }
    
    if (upcomingAppointments.length > 0) {
        console.log('Próximas citas:', upcomingAppointments);
    }
}

// Llamar recordatorios al cargar la página
setTimeout(showReminders, 3000);