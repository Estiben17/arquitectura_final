import asistenciaService from '../Service/asistenciaService.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const btnNewAttendance = document.getElementById('btn-new-attendance');
  const btnFillAttendance = document.getElementById('btn-fill-attendance');
  const attendanceForm = document.getElementById('attendance-form');
  const fillAttendanceForm = document.getElementById('fill-attendance-form');
  const attendanceTable = document.getElementById('attendance-table-body');
  
  // Modal handlers
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  // Mostrar modal de nueva asistencia
  btnNewAttendance.addEventListener('click', () => {
    document.getElementById('attendance-modal').style.display = 'block';
  });
  
  // Mostrar modal de llenar asistencia
  btnFillAttendance.addEventListener('click', () => {
    document.getElementById('fill-attendance-modal').style.display = 'block';
  });
  
  // Cerrar modales
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      modals.forEach(modal => modal.style.display = 'none');
    });
  });
  
  // Formulario para crear nueva asistencia
  attendanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const asistenciaData = {
      idAsignatura: document.getElementById('attendance-code').value,
      nombreAsignatura: document.getElementById('attendance-subject').value,
      grupo: document.getElementById('attendance-group').value,
      semestre: document.getElementById('attendance-semester').value,
      fecha: document.getElementById('attendance-date').value,
      horaInicio: document.getElementById('attendance-time-start').value,
      horaFin: document.getElementById('attendance-time-end').value,
      estudiantes: [] // Se llenará después
    };
    
    try {
      await asistenciaService.crearAsistencia(asistenciaData);
      alert('Asistencia creada correctamente');
      modals.forEach(modal => modal.style.display = 'none');
      cargarAsistencias();
    } catch (error) {
      console.error('Error al crear asistencia:', error);
      alert('Error al crear asistencia: ' + error.message);
    }
  });
  
  // Formulario para llenar asistencia
  fillAttendanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Aquí iría la lógica para guardar las asistencias de los estudiantes
    // ...
    
    alert('Asistencias registradas correctamente');
    modals.forEach(modal => modal.style.display = 'none');
  });
  
  // Cargar asistencias al iniciar
  async function cargarAsistencias() {
    try {
      const asistencias = await asistenciaService.obtenerAsistencias();
      actualizarTablaAsistencias(asistencias);
      actualizarEstadisticas(asistencias);
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
    }
  }
  
  // Actualizar la tabla de asistencias
  function actualizarTablaAsistencias(asistencias) {
    attendanceTable.innerHTML = '';
    
    asistencias.forEach(asistencia => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${asistencia.id}</td>
        <td>${asistencia.fecha}</td>
        <td>${asistencia.horaInicio}</td>
        <td>${asistencia.horaFin}</td>
        <td>${asistencia.idAsignatura}</td>
        <td>${asistencia.nombreAsignatura}</td>
        <td>${asistencia.grupo}</td>
        <td>${asistencia.semestre}</td>
        <td>${asistencia.estudiantes.length}</td>
        <td>
          <button class="btn-action view-btn" data-id="${asistencia.id}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-action edit-btn" data-id="${asistencia.id}">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      `;
      
      attendanceTable.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => mostrarDetalleAsistencia(btn.dataset.id));
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editarAsistencia(btn.dataset.id));
    });
  }
  
  // Mostrar detalle de una asistencia
  async function mostrarDetalleAsistencia(id) {
    try {
      // Aquí iría la lógica para obtener y mostrar los detalles
      // ...
      
      document.getElementById('view-attendance-modal').style.display = 'block';
    } catch (error) {
      console.error('Error al mostrar detalle:', error);
    }
  }
  
  // Editar una asistencia
  async function editarAsistencia(id) {
    try {
      // Aquí iría la lógica para editar
      // ...
    } catch (error) {
      console.error('Error al editar asistencia:', error);
    }
  }
  
  // Actualizar estadísticas
  function actualizarEstadisticas(asistencias) {
    const total = asistencias.length;
    const registradas = asistencias.filter(a => a.estudiantes.length > 0).length;
    const porcentaje = total > 0 ? Math.round((registradas / total) * 100) : 0;
    
    document.getElementById('total-attendance').textContent = total;
    document.getElementById('registered-attendance').textContent = registradas;
    document.getElementById('attendance-percentage').textContent = `${porcentaje}%`;
  }
  
  // Inicializar
  cargarAsistencias();
});