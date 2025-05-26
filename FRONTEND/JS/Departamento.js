import apiClient from './apiClient.js'; // Importa el cliente API

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script Departamento.js cargado');

    // Variable global para almacenar el ID del departamento actualmente seleccionado.
    // Esto es CRUCIAL para saber qué departamento se va a editar o consultar.
    let currentSelectedDepartmentId = null;

    // --- Elementos del DOM ---
    // Botones de acciones principales
    const btnViewDepartment = document.getElementById('btn-view-department');
    const btnEditDepartment = document.getElementById('btn-edit-department');
    const btnSearchStudent = document.getElementById('btn-search-student');

    // Modales (referencias directas para mejor legibilidad y rendimiento)
    const viewDepartmentModal = document.getElementById('view-department-modal');
    const editDepartmentModal = document.getElementById('edit-department-modal');
    const allModals = document.querySelectorAll('.modal'); // Para la función cerrarModales
    const closeButtons = document.querySelectorAll('.close-modal'); // Botones genéricos de cerrar modal

    // Elementos de búsqueda y filtro de departamentos
    const departmentSearchInput = document.getElementById('department-search'); // Renombrado para claridad
    const departmentFilterSelect = document.getElementById('department-filter'); // Renombrado para claridad

    // Formulario de edición de departamento
    const departmentForm = document.getElementById('department-form');

    // Elementos de la sección principal de detalles del departamento
    const departmentIdDisplay = document.getElementById('department-id-display');
    const departmentCodeDisplay = document.getElementById('department-code');
    const departmentNameDisplay = document.getElementById('department-name-display');
    const departmentCreationDateDisplay = document.getElementById('department-creation-date-display');
    const departmentUpdateDateDisplay = document.getElementById('department-update-date-display');
    const departmentStatusDisplay = document.getElementById('department-status-display');
    const departmentDirectorDisplay = document.getElementById('department-director');
    const departmentDescriptionDisplay = document.getElementById('department-description');
    const totalStudentsDisplay = document.getElementById('total-students');
    const totalProfessorsDisplay = document.getElementById('total-professors');
    const totalSubjectsDisplay = document.getElementById('total-subjects');

    // Elementos del formulario de edición en el modal
    const editDepartmentIdInput = document.getElementById('edit-department-id');
    const editDepartmentCodeInput = document.getElementById('department-code-input');
    const editDepartmentNameInput = document.getElementById('edit-department-name');
    const editDepartmentDirectorInput = document.getElementById('department-director-input');
    const editDepartmentStatusSelect = document.getElementById('edit-department-status');
    const editDepartmentDescriptionInput = document.getElementById('department-description-input');
    
    // Elementos de búsqueda de estudiante
    const studentDocumentTypeInput = document.getElementById('student-document-type-input');
    const studentIdInput = document.getElementById('student-id-input');
    const studentSearchResultDiv = document.getElementById('student-search-result');
    const noStudentResultsDiv = document.getElementById('no-student-results');

    // --- Verificación y Event Listeners ---
    if (!btnViewDepartment || !btnEditDepartment || !btnSearchStudent || !viewDepartmentModal || !editDepartmentModal || !departmentSearchInput || !departmentFilterSelect || !departmentForm) {
        console.error('Error: No se encontraron algunos elementos DOM esenciales. Verifica los IDs en tu HTML.');
        return; // Detener la ejecución si no se encuentran elementos clave
    }

    console.log('Elementos DOM esenciales encontrados y listos.');

    // Event Listeners para botones de acción principal
    btnViewDepartment.addEventListener('click', mostrarModalVerDepartamento);
    btnEditDepartment.addEventListener('click', mostrarModalEditarDepartamento);
    btnSearchStudent.addEventListener('click', buscarEstudiante);

    // Cerrar modales (delegado a un solo handler)
    closeButtons.forEach(button => {
        button.addEventListener('click', cerrarModales);
    });

    // Búsqueda y filtrado de departamentos
    departmentSearchInput.addEventListener('input', buscarDepartamentos);
    departmentFilterSelect.addEventListener('change', buscarDepartamentos);

    // Envío del formulario de edición de departamento
    departmentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío tradicional del formulario
        enviarFormularioEdicion(); // La función misma maneja errores
    });

    // --- Inicialización de la aplicación ---
    inicializarAplicacion(); // La función misma maneja errores

    // --------------------------
    // Funciones principales
    // --------------------------

    /**
     * Inicializa la aplicación: carga el primer departamento por defecto y el listado.
     */
    async function inicializarAplicacion() {
        console.log('Inicializando aplicación...');
        try {
            const departamentos = await apiClient.obtenerDepartamentos({});
            console.log('Departamentos obtenidos en inicialización:', departamentos);

            if (departamentos && departamentos.length > 0) {
                // Selecciona el primer departamento por defecto y carga sus datos en la sección principal
                await cargarDepartamentoSeleccionado(departamentos[0].id);
            } else {
                console.log('No se encontraron departamentos al inicio.');
                // Opcional: mostrar un mensaje en la UI de que no hay departamentos
            }
            // Muestra la lista completa de departamentos en la tabla
            await mostrarListadoDepartamentos(departamentos);

        } catch (error) {
            console.error('Error en inicializarAplicacion:', error);
            mostrarNotificacion('Error al cargar datos iniciales de departamentos', 'error');
        }
    }

    /**
     * Carga los datos de un departamento específico en la sección principal de la interfaz.
     * También actualiza el ID del departamento seleccionado globalmente.
     * @param {string} id El ID del departamento a cargar.
     */
    async function cargarDepartamentoSeleccionado(id) {
        console.log(`Cargando departamento seleccionado con ID: ${id}`);
        try {
            const departamento = await apiClient.obtenerDepartamentoPorId(id);
            if (departamento) {
                // Almacena el ID del departamento seleccionado globalmente
                currentSelectedDepartmentId = departamento.id;
                console.log('Departamento seleccionado actualizado globalmente:', currentSelectedDepartmentId);

                // Actualiza la información en la sección principal del HTML
                // Se agregó `|| 'N/A'` para manejar casos donde el campo podría estar ausente
                departmentIdDisplay.textContent = departamento.id; 
                departmentCodeDisplay.textContent = departamento.codigo || 'N/A';
                departmentNameDisplay.textContent = departamento.nombre || 'N/A';
                departmentCreationDateDisplay.textContent = departamento.fechaCreacion ? new Date(departamento.fechaCreacion).toLocaleDateString() : 'N/A';
                departmentUpdateDateDisplay.textContent = departamento.fechaActualizacion ? new Date(departamento.fechaActualizacion).toLocaleDateString() : 'N/A';
                departmentStatusDisplay.textContent = departamento.estado || 'N/A';
                departmentStatusDisplay.className = `status-badge ${departamento.estado === 'Activo' ? 'active' : 'inactive'}`; // Actualiza la clase del badge
                departmentDirectorDisplay.textContent = departamento.director || 'N/A';
                departmentDescriptionDisplay.textContent = departamento.descripcion || 'N/A';

                // Cargar estadísticas relacionadas con el departamento
                const stats = await apiClient.obtenerEstadisticasDepartamento(id);
                totalStudentsDisplay.textContent = stats.totalEstudiantes !== undefined ? stats.totalEstudiantes : 0;
                totalProfessorsDisplay.textContent = stats.totalProfesores !== undefined ? stats.totalProfesores : 0;
                totalSubjectsDisplay.textContent = stats.totalAsignaturas !== undefined ? stats.totalAsignaturas : 0;

            } else {
                mostrarNotificacion('Departamento no encontrado para el ID: ' + id, 'error');
                console.warn('Departamento no encontrado para el ID:', id);
            }
        } catch (error) {
            console.error('Error al cargar departamento seleccionado:', error);
            mostrarNotificacion('Error al cargar el departamento y sus estadísticas', 'error');
        }
    }

    /**
     * Realiza la búsqueda y filtrado de departamentos y actualiza la tabla.
     */
    async function buscarDepartamentos() {
        console.log('Realizando búsqueda/filtrado de departamentos...');
        try {
            const busqueda = departmentSearchInput.value;
            const estado = departmentFilterSelect.value;
            const departamentos = await apiClient.obtenerDepartamentos({ busqueda, estado });
            mostrarListadoDepartamentos(departamentos);
        } catch (error) {
            console.error('Error al buscar departamentos:', error);
            mostrarNotificacion('Error al buscar departamentos', 'error');
        }
    }

    /**
     * Envía el formulario de edición para actualizar un departamento.
     */
    async function enviarFormularioEdicion() {
        console.log('Intentando enviar formulario de edición...');

        if (!currentSelectedDepartmentId) {
            mostrarNotificacion('No se ha seleccionado ningún departamento para actualizar.', 'warning');
            console.warn('No hay departamento seleccionado para enviar formulario de edición.');
            return;
        }

        const nuevosDatos = {
            nombre: editDepartmentNameInput.value,
            estado: editDepartmentStatusSelect.value,
            director: editDepartmentDirectorInput.value,
            descripcion: editDepartmentDescriptionInput.value,
        };

        try {
            console.log('Actualizando departamento con ID:', currentSelectedDepartmentId, 'Datos:', nuevosDatos);
            await apiClient.actualizarDepartamento(currentSelectedDepartmentId, nuevosDatos);
            mostrarNotificacion('Departamento actualizado correctamente', 'success');
            cerrarModales();
            // Después de actualizar, recarga la información del departamento en la sección principal
            await cargarDepartamentoSeleccionado(currentSelectedDepartmentId);
            // Y recarga la lista de departamentos para reflejar los cambios
            await buscarDepartamentos();
        } catch (error) {
            console.error('Error al actualizar departamento:', error);
            mostrarNotificacion(`Error al actualizar departamento: ${error.message}`, 'error');
        }
    }

    /**
     * Muestra el modal para ver los detalles del departamento.
     */
    function mostrarModalVerDepartamento() {
        console.log('Intentando mostrar modal de visualización...');
        if (!currentSelectedDepartmentId) {
            mostrarNotificacion('Por favor, selecciona un departamento para ver sus detalles.', 'warning');
            console.warn('No hay departamento seleccionado para mostrar el modal de visualización.');
            return;
        }

        // Aquí podrías opcionalmente recargar los datos del departamento para asegurar que sean los más recientes,
        // pero por simplicidad, asumimos que 'cargarDepartamentoSeleccionado' ya actualizó los `span` principales.
        // Si el modal tiene sus propios campos y no solo réplicas de los principales, necesitarías precargar el modal de vista aquí.
        
        // Asigna los valores a los elementos del modal de vista
        document.getElementById('view-department-code').textContent = departmentCodeDisplay.textContent;
        document.getElementById('view-department-name').textContent = departmentNameDisplay.textContent;
        document.getElementById('view-department-date').textContent = departmentCreationDateDisplay.textContent;
        document.getElementById('view-department-status').textContent = departmentStatusDisplay.textContent;
        document.getElementById('view-department-status').className = departmentStatusDisplay.className; // Copiar la clase del estado
        document.getElementById('view-department-director').textContent = departmentDirectorDisplay.textContent;
        document.getElementById('view-department-description').textContent = departmentDescriptionDisplay.textContent;


        if (viewDepartmentModal) {
            viewDepartmentModal.style.display = 'block';
            console.log('Modal de visualización de departamento mostrado.');
        } else {
            console.error('Modal de visualización (#view-department-modal) no encontrado.');
            mostrarNotificacion('Error: El modal de visualización no se encontró.', 'error');
        }
    }

    /**
     * Muestra el modal para editar un departamento y precarga sus datos.
     */
    async function mostrarModalEditarDepartamento() {
        console.log('Intentando mostrar modal de edición...');
        if (!currentSelectedDepartmentId) {
            mostrarNotificacion('Por favor, selecciona un departamento primero para editarlo.', 'warning');
            console.warn('No hay departamento seleccionado para abrir el modal de edición.');
            return;
        }

        try {
            const departamento = await apiClient.obtenerDepartamentoPorId(currentSelectedDepartmentId);
            console.log('Datos del departamento obtenidos para edición:', departamento);
            if (departamento) {
                // Rellenar los campos del formulario de edición del modal
                editDepartmentIdInput.value = departamento.id; // Campo oculto del ID
                editDepartmentCodeInput.value = departamento.codigo || '';
                editDepartmentNameInput.value = departamento.nombre || '';
                editDepartmentDirectorInput.value = departamento.director || '';
                editDepartmentStatusSelect.value = departamento.estado || 'Activo'; // Valor predeterminado
                editDepartmentDescriptionInput.value = departamento.descripcion || '';

                if (editDepartmentModal) {
                    editDepartmentModal.style.display = 'block';
                    console.log('Modal de edición de departamento mostrado y datos precargados.');
                } else {
                    console.error('Elemento del modal de edición no encontrado.');
                    mostrarNotificacion('Error: El modal de edición no se encontró.', 'error');
                }
            } else {
                mostrarNotificacion('Departamento no encontrado para edición.', 'error');
                console.warn('Departamento no encontrado para el ID:', currentSelectedDepartmentId);
            }
        } catch (error) {
            console.error('Error al cargar datos para edición de departamento:', error);
            mostrarNotificacion('Error al cargar datos para edición', 'error');
        }
    }

    /**
     * Renderiza la lista de departamentos en la tabla.
     * @param {Array<Object>} departamentos - Un array de objetos de departamento.
     */
    function mostrarListadoDepartamentos(departamentos) {
        console.log('Mostrando listado de departamentos en la tabla...');
        const tableBody = document.getElementById('department-list-body');
        if (!tableBody) {
            console.error('No se encontró el cuerpo de la tabla de departamentos (#department-list-body).');
            return;
        }
        tableBody.innerHTML = ''; // Limpia el cuerpo de la tabla

        if (!departamentos || departamentos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No hay departamentos disponibles o que coincidan con la búsqueda.</td></tr>';
            return;
        }

        departamentos.forEach(dep => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dep.nombre || 'N/A'}</td>
                <td><span class="status-badge ${dep.estado === 'Activo' ? 'active' : 'inactive'}">${dep.estado || 'N/A'}</span></td>
                <td>${dep.fechaCreacion ? new Date(dep.fechaCreacion).toLocaleDateString() : 'N/A'}</td>
                <td>${dep.fechaActualizacion ? new Date(dep.fechaActualizacion).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="btn-action select-department-btn" data-id="${dep.id}">Seleccionar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Añadir event listeners a los nuevos botones "Seleccionar"
        document.querySelectorAll('.select-department-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                cargarDepartamentoSeleccionado(id); // Al hacer clic, carga los datos de ese departamento en la sección principal
                mostrarNotificacion('Departamento seleccionado.', 'info');
            });
        });
    }

    /**
     * Busca un estudiante por tipo y número de documento y muestra sus detalles.
     */
    async function buscarEstudiante() {
        console.log('Buscando estudiante...');
        try {
            if (!studentDocumentTypeInput || !studentIdInput || !studentSearchResultDiv || !noStudentResultsDiv) {
                console.error('Error: No se encontraron todos los elementos para la búsqueda de estudiantes.');
                mostrarNotificacion('Error interno al buscar estudiante. Faltan elementos DOM.', 'error');
                return;
            }

            const tipoDocumento = studentDocumentTypeInput.value;
            const numeroDocumento = studentIdInput.value.trim();

            if (!tipoDocumento || !numeroDocumento) {
                mostrarNotificacion('Por favor, ingrese tipo y número de documento para buscar.', 'warning');
                studentSearchResultDiv.style.display = 'none';
                noStudentResultsDiv.style.display = 'block'; // Mostrar mensaje de "no resultados" inicial
                return;
            }

            console.log(`Buscando estudiante - Tipo: ${tipoDocumento}, Número: ${numeroDocumento}`);

            const estudiante = await apiClient.buscarEstudiantePorDocumento(tipoDocumento, numeroDocumento);

            if (estudiante) {
                // Rellenar la información del estudiante en la tarjeta de resultados
                document.getElementById('student-id').textContent = estudiante.numeroDocumento || 'N/A';
                document.getElementById('student-name').textContent = `${estudiante.nombre || ''} ${estudiante.apellidos || ''}`.trim();
                document.getElementById('student-birthdate').textContent = estudiante.fechaNacimiento ? new Date(estudiante.fechaNacimiento).toLocaleDateString() : 'N/A';
                document.getElementById('student-gender').textContent = estudiante.genero || 'N/A';
                document.getElementById('student-faculty').textContent = estudiante.facultad || 'N/A';
                document.getElementById('student-program').textContent = estudiante.programa || 'N/A';
                document.getElementById('student-semester').textContent = estudiante.semestre || 'N/A';
                document.getElementById('student-average').textContent = estudiante.promedioNotas !== undefined ? estudiante.promedioNotas.toFixed(2) : 'N/A';
                document.getElementById('student-email').textContent = estudiante.email || 'N/A';
                document.getElementById('student-phone').textContent = estudiante.telefono || 'N/A';
                document.getElementById('student-address').textContent = estudiante.direccion || 'N/A';
                document.getElementById('student-status').textContent = estudiante.estado || 'N/A';
                document.getElementById('student-status').className = `status-badge ${estudiante.estado === 'Activo' ? 'active' : 'inactive'}`;

                studentSearchResultDiv.style.display = 'block';
                noStudentResultsDiv.style.display = 'none';
                mostrarNotificacion('Estudiante encontrado.', 'success');
            } else {
                // Si no se encuentra, ocultar resultados y mostrar mensaje de no resultados
                studentSearchResultDiv.style.display = 'none';
                noStudentResultsDiv.style.display = 'block';
                mostrarNotificacion('Estudiante no encontrado.', 'info');
            }
        } catch (error) {
            console.error('Error en buscarEstudiante:', error);
            mostrarNotificacion(`Error al buscar estudiante: ${error.message}`, 'error');
        }
    }

    /**
     * Cierra todos los modales abiertos.
     */
    function cerrarModales() {
        console.log('Cerrando modales...');
        allModals.forEach(modal => modal.style.display = 'none');
    }

    /**
     * Muestra una notificación temporal al usuario.
     * @param {string} mensaje - El mensaje a mostrar.
     * @param {string} tipo - El tipo de notificación ('success', 'error', 'warning', 'info').
     */
    function mostrarNotificacion(mensaje, tipo = 'success') {
        try {
            const notificacion = document.createElement('div');
            notificacion.className = `notification ${tipo}`;
            notificacion.textContent = mensaje;
            document.body.appendChild(notificacion);

            setTimeout(() => {
                notificacion.remove();
            }, 3000); // La notificación desaparece después de 3 segundos
        } catch (error) {
            console.error('Error al mostrar notificación visual:', error);
            alert(`${tipo.toUpperCase()}: ${mensaje}`); // Fallback a alert() en caso de error
        }
    }
});