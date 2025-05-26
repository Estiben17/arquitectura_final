import departamentoService from '../../services/departamentoService.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Script Departamento.js cargado');

  // Elementos del DOM con verificación
  const btnViewDepartment = document.getElementById('btn-view-department');
  const btnEditDepartment = document.getElementById('btn-edit-department');
  const btnSearchStudent = document.getElementById('btn-search-student');
  
  if (!btnViewDepartment || !btnEditDepartment || !btnSearchStudent) {
    console.error('Error: No se encontraron algunos botones');
    return;
  }

  console.log('Botones encontrados:', {
    btnViewDepartment,
    btnEditDepartment,
    btnSearchStudent
  });

  // Modales
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  // Event Listeners con logs
  btnViewDepartment.addEventListener('click', () => {
    console.log('Click en Ver Departamento');
    mostrarModalVerDepartamento().catch(error => {
      console.error('Error en mostrarModalVerDepartamento:', error);
    });
  });
  
  btnEditDepartment.addEventListener('click', () => {
    console.log('Click en Editar Departamento');
    mostrarModalEditarDepartamento().catch(error => {
      console.error('Error en mostrarModalEditarDepartamento:', error);
    });
  });
  
  btnSearchStudent.addEventListener('click', () => {
    console.log('Click en Buscar Estudiante');
    buscarEstudiante().catch(error => {
      console.error('Error en buscarEstudiante:', error);
    });
  });
  
  // Cerrar modales
  closeButtons.forEach(button => {
    button.addEventListener('click', cerrarModales);
  });
  
  // Búsqueda y filtrado
  const departmentSearch = document.getElementById('department-search');
  const departmentFilter = document.getElementById('department-filter');
  
  if (departmentSearch && departmentFilter) {
    departmentSearch.addEventListener('input', buscarDepartamentos);
    departmentFilter.addEventListener('change', buscarDepartamentos);
  }
  
  // Formulario de edición
  const departmentForm = document.getElementById('department-form');
  if (departmentForm) {
    departmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      enviarFormularioEdicion(e).catch(error => {
        console.error('Error en enviarFormularioEdicion:', error);
      });
    });
  }
  
  // Cargar datos iniciales
  inicializarAplicacion().catch(error => {
    console.error('Error en inicialización:', error);
  });

  // --------------------------
  // Funciones principales con try/catch
  // --------------------------

  async function inicializarAplicacion() {
    try {
      console.log('Inicializando aplicación...');
      const departamentos = await departamentoService.obtenerDepartamentos({});
      console.log('Departamentos obtenidos:', departamentos);
      
      if (departamentos.length > 0) {
        await cargarDepartamentoSeleccionado(departamentos[0].id);
      }
      await mostrarListadoDepartamentos(departamentos);
    } catch (error) {
      console.error('Error en inicializarAplicacion:', error);
      mostrarNotificacion('Error al cargar datos iniciales', 'error');
    }
  }

  // ... (mantén el resto de las funciones como en la versión anterior)
  // Pero asegúrate de que cada una tenga try/catch y logs

  async function buscarEstudiante() {
    try {
      const documentoInput = document.getElementById('student-id-input');
      if (!documentoInput) {
        console.error('No se encontró el input de documento');
        return;
      }
      
      const documento = documentoInput.value.trim();
      console.log('Buscando estudiante con documento:', documento);
      
      // Resto de la función...
    } catch (error) {
      console.error('Error en buscarEstudiante:', error);
      throw error; // Re-lanzar para manejar en el caller
    }
  }

  // Función para mostrar notificaciones aunque falle todo lo demás
  function mostrarNotificacion(mensaje, tipo = 'success') {
    try {
      // Intenta mostrar la notificación de manera elegante
      const notificacion = document.createElement('div');
      notificacion.className = `notification ${tipo}`;
      notificacion.textContent = mensaje;
      document.body.appendChild(notificacion);
      
      setTimeout(() => {
        notificacion.remove();
      }, 3000);
    } catch (error) {
      // Si falla, usa un alert básico
      console.error('Error al mostrar notificación:', error);
      alert(`${tipo.toUpperCase()}: ${mensaje}`);
    }
  }
});