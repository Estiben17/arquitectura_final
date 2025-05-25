import departamentoService from '../services/departamentoService.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const btnViewDepartment = document.getElementById('btn-view-department');
  const btnEditDepartment = document.getElementById('btn-edit-department');
  const btnSearchStudent = document.getElementById('btn-search-student');
  const departmentForm = document.getElementById('department-form');
  const departmentSearch = document.getElementById('department-search');
  const departmentFilter = document.getElementById('department-filter');
  
  // Modales
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  // Mostrar modal de visualización
  btnViewDepartment.addEventListener('click', mostrarModalVerDepartamento);
  
  // Mostrar modal de edición
  btnEditDepartment.addEventListener('click', mostrarModalEditarDepartamento);
  
  // Buscar estudiante
  btnSearchStudent.addEventListener('click', buscarEstudiante);
  
  // Cerrar modales
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      modals.forEach(modal => modal.style.display = 'none');
    });
  });
  
  // Formulario de edición de departamento
  departmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datosActualizados = {
      nombre: document.getElementById('department-name-input').value,
      director: document.getElementById('department-director-input').value,
      estado: document.getElementById('department-status-input').value,
      descripcion: document.getElementById('department-description-input').value
    };
    
    try {
      // Aquí deberías obtener el ID del departamento actual
      const idDepartamento = 'DEPT-001'; // Esto debería ser dinámico
      
      await departamentoService.actualizarDepartamento(idDepartamento, datosActualizados);
      alert('Departamento actualizado correctamente');
      modals.forEach(modal => modal.style.display = 'none');
      cargarDepartamentoActual();
    } catch (error) {
      console.error('Error al actualizar departamento:', error);
      alert('Error al actualizar departamento: ' + error.message);
    }
  });
  
  // Búsqueda de departamentos
  departmentSearch.addEventListener('input', buscarDepartamentos);
  departmentFilter.addEventListener('change', buscarDepartamentos);
  
  // Cargar datos iniciales
  async function cargarDepartamentoActual() {
    try {
      // Aquí deberías obtener el ID del departamento actual
      const idDepartamento = 'DEPT-001'; // Esto debería ser dinámico
      
      const departamento = await departamentoService.obtenerDepartamentoPorId(idDepartamento);
      const estadisticas = await departamentoService.obtenerEstadisticasDepartamento(idDepartamento);
      
      actualizarVistaDepartamento(departamento, estadisticas);
    } catch (error) {
      console.error('Error al cargar departamento:', error);
    }
  }
  
  // Actualizar la vista del departamento
  function actualizarVistaDepartamento(departamento, estadisticas) {
    document.getElementById('department-code').textContent = departamento.codigo;
    document.getElementById('department-name').textContent = departamento.nombre;
    document.getElementById('department-creation-date').textContent = new Date(departamento.fechaCreacion).toLocaleDateString();
    document.getElementById('department-director').textContent = departamento.director;
    document.getElementById('department-description').textContent = departamento.descripcion;
    
    // Actualizar estado
    const statusBadge = document.querySelector('#department-details .status-badge');
    statusBadge.textContent = departamento.estado === 'active' ? 'Activo' : 'Inactivo';
    statusBadge.className = `status-badge ${departamento.estado}`;
    
    // Actualizar estadísticas
    document.querySelector('.department-statistics .stat-card:nth-child(1) .stat-value').textContent = estadisticas.totalEstudiantes;
    document.querySelector('.department-statistics .stat-card:nth-child(2) .stat-value').textContent = estadisticas.totalProfesores;
    document.querySelector('.department-statistics .stat-card:nth-child(3) .stat-value').textContent = estadisticas.totalAsignaturas;
  }
  
  // Buscar departamentos
  async function buscarDepartamentos() {
    try {
      const filtros = {
        busqueda: departmentSearch.value,
        estado: departmentFilter.value
      };
      
      const departamentos = await departamentoService.obtenerDepartamentos(filtros);
      // Aquí deberías actualizar la lista de departamentos en la UI
    } catch (error) {
      console.error('Error al buscar departamentos:', error);
    }
  }
  
  // Buscar estudiante
  async function buscarEstudiante() {
    try {
      const documento = document.getElementById('student-id-input').value;
      
      if (!documento) {
        alert('Por favor ingrese un documento de identidad');
        return;
      }
      
      const estudiante = await departamentoService.buscarEstudiantePorDocumento(documento);
      
      if (estudiante) {
        mostrarResultadoEstudiante(estudiante);
      } else {
        document.getElementById('student-results').style.display = 'none';
        document.getElementById('no-student-results').style.display = 'block';
      }
    } catch (error) {
      console.error('Error al buscar estudiante:', error);
      alert('Error al buscar estudiante: ' + error.message);
    }
  }
  
  // Mostrar resultado de búsqueda de estudiante
  function mostrarResultadoEstudiante(estudiante) {
    document.getElementById('student-results').style.display = 'block';
    document.getElementById('no-student-results').style.display = 'none';
    
    document.getElementById('student-id').textContent = estudiante.documento;
    document.getElementById('student-name').textContent = `${estudiante.nombres} ${estudiante.apellidos}`;
    document.getElementById('student-birthdate').textContent = new Date(estudiante.fechaNacimiento).toLocaleDateString();
    document.getElementById('student-gender').textContent = estudiante.genero === 'M' ? 'Masculino' : 'Femenino';
    document.getElementById('student-faculty').textContent = estudiante.facultad;
    document.getElementById('student-program').textContent = estudiante.programa;
    document.getElementById('student-semester').textContent = estudiante.semestre;
    document.getElementById('student-average').textContent = estudiante.promedio?.toFixed(2) || 'N/A';
    document.getElementById('student-email').textContent = estudiante.correo;
    document.getElementById('student-phone').textContent = estudiante.telefono;
    document.getElementById('student-address').textContent = estudiante.direccion;
    
    // Actualizar estado
    const statusBadge = document.getElementById('student-status');
    statusBadge.textContent = estudiante.estado === 'active' ? 'Activo' : 'Inactivo';
    statusBadge.className = `status-badge ${estudiante.estado}`;
  }
  
  // Mostrar modal de ver departamento
  async function mostrarModalVerDepartamento() {
    try {
      // Aquí deberías obtener el ID del departamento actual
      const idDepartamento = 'DEPT-001'; // Esto debería ser dinámico
      
      const departamento = await departamentoService.obtenerDepartamentoPorId(idDepartamento);
      
      document.getElementById('view-department-code').textContent = departamento.codigo;
      document.getElementById('view-department-name').textContent = departamento.nombre;
      document.getElementById('view-department-date').textContent = new Date(departamento.fechaCreacion).toLocaleDateString();
      document.getElementById('view-department-director').textContent = departamento.director;
      document.getElementById('view-department-description').textContent = departamento.descripcion;
      
      // Actualizar estado en el modal
      const statusBadge = document.querySelector('#view-department-modal .status-badge');
      statusBadge.textContent = departamento.estado === 'active' ? 'Activo' : 'Inactivo';
      statusBadge.className = `status-badge ${departamento.estado}`;
      
      document.getElementById('view-department-modal').style.display = 'block';
    } catch (error) {
      console.error('Error al mostrar departamento:', error);
      alert('Error al mostrar departamento: ' + error.message);
    }
  }
  
  // Mostrar modal de editar departamento
  async function mostrarModalEditarDepartamento() {
    try {
      // Aquí deberías obtener el ID del departamento actual
      const idDepartamento = 'DEPT-001'; // Esto debería ser dinámico
      
      const departamento = await departamentoService.obtenerDepartamentoPorId(idDepartamento);
      
      document.getElementById('department-code-input').value = departamento.codigo;
      document.getElementById('department-name-input').value = departamento.nombre;
      document.getElementById('department-director-input').value = departamento.director;
      document.getElementById('department-status-input').value = departamento.estado;
      document.getElementById('department-description-input').value = departamento.descripcion;
      
      document.getElementById('edit-department-modal').style.display = 'block';
    } catch (error) {
      console.error('Error al cargar datos para edición:', error);
      alert('Error al cargar datos para edición: ' + error.message);
    }
  }
  
  // Inicializar
  cargarDepartamentoActual();
});