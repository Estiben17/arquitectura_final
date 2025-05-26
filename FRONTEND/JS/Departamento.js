// JS/Departamento.js

import apiClient from './apiClient.js'; // Importa el cliente API

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script Departamento.js cargado');

    // Variable global para almacenar el ID del departamento actualmente seleccionado.
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
    const departmentSearchInput = document.getElementById('department-search');
    const departmentFilterSelect = document.getElementById('department-filter');

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

    // Elementos de la tarjeta de información del estudiante (asegúrate de que estos IDs existan en tu HTML)
    const studentIdDisplay = document.getElementById('student-id');
    const studentNameDisplay = document.getElementById('student-name');
    const studentBirthdateDisplay = document.getElementById('student-birthdate');
    const studentGenderDisplay = document.getElementById('student-gender');
    const studentFacultyDisplay = document.getElementById('student-faculty');
    const studentProgramDisplay = document.getElementById('student-program');
    const studentSemesterDisplay = document.getElementById('student-semester');
    const studentAverageDisplay = document.getElementById('student-average');
    const studentEmailDisplay = document.getElementById('student-email');
    const studentPhoneDisplay = document.getElementById('student-phone');
    const studentAddressDisplay = document.getElementById('student-address');
    const studentStatusDisplay = document.getElementById('student-status');


    // --- Verificación de elementos DOM esenciales (para depuración) ---
    const essentialDepartmentElements = [
        btnViewDepartment, btnEditDepartment, viewDepartmentModal, editDepartmentModal,
        departmentSearchInput, departmentFilterSelect, departmentForm,
        departmentIdDisplay, departmentCodeDisplay, departmentNameDisplay,
        departmentCreationDateDisplay, departmentUpdateDateDisplay, departmentStatusDisplay,
        departmentDirectorDisplay, departmentDescriptionDisplay, totalStudentsDisplay,
        totalProfessorsDisplay, totalSubjectsDisplay, editDepartmentIdInput,
        editDepartmentCodeInput, editDepartmentNameInput, editDepartmentDirectorInput,
        editDepartmentStatusSelect, editDepartmentDescriptionInput
    ];
    essentialDepartmentElements.forEach(el => {
        if (!el) console.warn('Elemento DOM de departamento no encontrado:', el);
    });

    const essentialStudentElements = [
        btnSearchStudent, studentDocumentTypeInput, studentIdInput,
        studentSearchResultDiv, noStudentResultsDiv, studentIdDisplay,
        studentNameDisplay, studentBirthdateDisplay, studentGenderDisplay,
        studentFacultyDisplay, studentProgramDisplay, studentSemesterDisplay,
        studentAverageDisplay, studentEmailDisplay, studentPhoneDisplay,
        studentAddressDisplay, studentStatusDisplay
    ];
    essentialStudentElements.forEach(el => {
        if (!el) console.warn('Elemento DOM de estudiante no encontrado:', el);
    });

    console.log('Verificación inicial de elementos DOM completada.');

    // --- Event Listeners ---
    if (btnViewDepartment) btnViewDepartment.addEventListener('click', mostrarModalVerDepartamento);
    if (btnEditDepartment) btnEditDepartment.addEventListener('click', mostrarModalEditarDepartamento);
    if (btnSearchStudent) btnSearchStudent.addEventListener('click', buscarEstudiante);

    closeButtons.forEach(button => {
        button.addEventListener('click', cerrarModales);
    });

    if (departmentSearchInput) departmentSearchInput.addEventListener('input', buscarDepartamentos);
    if (departmentFilterSelect) departmentFilterSelect.addEventListener('change', buscarDepartamentos);

    if (departmentForm) {
        departmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            enviarFormularioEdicion();
        });
    }

    // --- Inicialización de la aplicación ---
    inicializarAplicacion();

    async function inicializarAplicacion() {
        console.log('Inicializando aplicación...');
        try {
            // **IMPORTANTE:** Asume que apiClient.obtenerDepartamentos devuelve directamente el array.
            const departamentos = await apiClient.obtenerDepartamentos({}); 
            console.log('Departamentos obtenidos en inicialización:', departamentos);

            if (departamentos && departamentos.length > 0) {
                await cargarDepartamentoSeleccionado(departamentos[0].id);
            } else {
                console.log('No se encontraron departamentos al inicio.');
            }
            await mostrarListadoDepartamentos(departamentos);

        } catch (error) {
            console.error('Error en inicializarAplicacion:', error);
            mostrarNotificacion('Error al cargar datos iniciales de departamentos', 'error');
        }
    }

    /**
     * 
     * 
     * @param {string} id El ID del departamento a cargar.
     */
    async function cargarDepartamentoSeleccionado(id) {
        console.log(`Cargando departamento seleccionado con ID: ${id}`);
        try {
            const departamento = await apiClient.obtenerDepartamentoPorId(id);
            if (departamento) {
                currentSelectedDepartmentId = departamento.id;
                console.log('Departamento seleccionado actualizado globalmente:', currentSelectedDepartmentId);

                // Actualiza la información en la sección principal del HTML
                if (departmentIdDisplay) departmentIdDisplay.textContent = departamento.id || 'N/A';
                if (departmentCodeDisplay) departmentCodeDisplay.textContent = departamento.codigo || 'N/A';
                if (departmentNameDisplay) departmentNameDisplay.textContent = departamento.nombre || 'N/A';
                if (departmentCreationDateDisplay) {
                    departmentCreationDateDisplay.textContent = departamento.fechaCreacion ? new Date(departamento.fechaCreacion).toLocaleDateString() : 'N/A';
                }
                if (departmentUpdateDateDisplay) {
                    departmentUpdateDateDisplay.textContent = departamento.fechaActualizacion ? new Date(departamento.fechaActualizacion).toLocaleDateString() : 'N/A';
                }
                if (departmentStatusDisplay) {
                    departmentStatusDisplay.textContent = departamento.estado || 'N/A';
                    departmentStatusDisplay.className = `status-badge ${departamento.estado === 'Activo' ? 'active' : 'inactive'}`;
                }
                if (departmentDirectorDisplay) departmentDirectorDisplay.textContent = departamento.director || 'N/A';
                if (departmentDescriptionDisplay) departmentDescriptionDisplay.textContent = departamento.descripcion || 'N/A';

                // Cargar estadísticas relacionadas con el departamento (Asegúrate de que tu apiClient y backend tengan este método)
                const stats = await apiClient.obtenerEstadisticasDepartamento(id);
                if (totalStudentsDisplay) totalStudentsDisplay.textContent = stats.totalEstudiantes !== undefined ? stats.totalEstudiantes : 0;
                if (totalProfessorsDisplay) totalProfessorsDisplay.textContent = stats.totalProfesores !== undefined ? stats.totalProfesores : 0;
                if (totalSubjectsDisplay) totalSubjectsDisplay.textContent = stats.totalAsignaturas !== undefined ? stats.totalAsignaturas : 0;

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
            // **IMPORTANTE:** Asume que apiClient.obtenerDepartamentos devuelve directamente el array.
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
            await cargarDepartamentoSeleccionado(currentSelectedDepartmentId);
            await buscarDepartamentos(); // Recarga la lista para reflejar cambios
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

        // Rellena los campos del modal de vista con la información de la sección principal
        // Esto asume que la sección principal ya tiene los datos más recientes.
        if (document.getElementById('view-department-code')) document.getElementById('view-department-code').textContent = departmentCodeDisplay.textContent;
        if (document.getElementById('view-department-name')) document.getElementById('view-department-name').textContent = departmentNameDisplay.textContent;
        if (document.getElementById('view-department-date')) document.getElementById('view-department-date').textContent = departmentCreationDateDisplay.textContent;
        if (document.getElementById('view-department-status')) {
            document.getElementById('view-department-status').textContent = departmentStatusDisplay.textContent;
            document.getElementById('view-department-status').className = departmentStatusDisplay.className;
        }
        if (document.getElementById('view-department-director')) document.getElementById('view-department-director').textContent = departmentDirectorDisplay.textContent;
        if (document.getElementById('view-department-description')) document.getElementById('view-department-description').textContent = departmentDescriptionDisplay.textContent;

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
                if (editDepartmentIdInput) editDepartmentIdInput.value = departamento.id || '';
                if (editDepartmentCodeInput) editDepartmentCodeInput.value = departamento.codigo || '';
                if (editDepartmentNameInput) editDepartmentNameInput.value = departamento.nombre || '';
                if (editDepartmentDirectorInput) editDepartmentDirectorInput.value = departamento.director || '';
                if (editDepartmentStatusSelect) editDepartmentStatusSelect.value = departamento.estado || 'Activo';
                if (editDepartmentDescriptionInput) editDepartmentDescriptionInput.value = departamento.descripcion || '';

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

        document.querySelectorAll('.select-department-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                cargarDepartamentoSeleccionado(id);
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
            // Asegúrate de que todos los elementos DOM necesarios existan
            const requiredStudentElements = [
                studentDocumentTypeInput, studentIdInput, studentSearchResultDiv, noStudentResultsDiv,
                studentIdDisplay, studentNameDisplay, studentBirthdateDisplay, studentGenderDisplay,
                studentFacultyDisplay, studentProgramDisplay, studentSemesterDisplay, studentAverageDisplay,
                studentEmailDisplay, studentPhoneDisplay, studentAddressDisplay, studentStatusDisplay
            ];
            const allElementsFound = requiredStudentElements.every(el => el !== null);
            if (!allElementsFound) {
                console.error('Error: No se encontraron todos los elementos DOM para la visualización de datos de estudiante.');
                mostrarNotificacion('Error interno al buscar estudiante. Faltan elementos DOM.', 'error');
                return;
            }

            const tipoDocumento = studentDocumentTypeInput.value;
            const numeroDocumento = studentIdInput.value.trim();

            if (!tipoDocumento || !numeroDocumento) {
                mostrarNotificacion('Por favor, ingrese tipo y número de documento para buscar.', 'warning');
                studentSearchResultDiv.style.display = 'none';
                noStudentResultsDiv.style.display = 'block';
                return;
            }

            console.log(`Buscando estudiante - Tipo: ${tipoDocumento}, Número: ${numeroDocumento}`);

            const estudiante = await apiClient.buscarEstudiantePorDocumento(tipoDocumento, numeroDocumento);

            if (estudiante) {
                console.log('Estudiante recibido del backend:', estudiante);
                
                // Rellenar la información del estudiante en la tarjeta de resultados
                // Nombres de campo ajustados para coincidir con Firestore / backend
                studentIdDisplay.textContent = estudiante["numero de documento"] || 'N/A';
                studentNameDisplay.textContent = `${estudiante.nombre || ''} ${estudiante.apellido || ''}`.trim();
                studentBirthdateDisplay.textContent = estudiante["Fecha Nacimiento"] ? new Date(estudiante["Fecha Nacimiento"]).toLocaleDateString() : 'N/A';
                studentGenderDisplay.textContent = estudiante.Género || 'N/A';
                studentFacultyDisplay.textContent = estudiante.facultad || 'N/A';
                studentProgramDisplay.textContent = estudiante.programa || 'N/A';
                studentSemesterDisplay.textContent = estudiante.Semestre || 'N/A';
                studentAverageDisplay.textContent = estudiante.Promedio !== undefined ? estudiante.Promedio.toFixed(2) : 'N/A';
                studentEmailDisplay.textContent = estudiante.Email || 'N/A';
                studentPhoneDisplay.textContent = estudiante.Teléfono || 'N/A';
                studentAddressDisplay.textContent = estudiante.Direccion || 'N/A'; 
                studentStatusDisplay.textContent = estudiante.estado || 'N/A';
                studentStatusDisplay.className = `status-badge ${estudiante.estado === 'Activo' ? 'active' : 'inactive'}`;

                studentSearchResultDiv.style.display = 'block';
                noStudentResultsDiv.style.display = 'none';
                mostrarNotificacion('Estudiante encontrado.', 'success');
            } else {
                studentSearchResultDiv.style.display = 'none';
                noStudentResultsDiv.style.display = 'block';
                mostrarNotificacion('Estudiante no encontrado.', 'info');
            }
        } catch (error) {
            console.error('Error en buscarEstudiante:', error);
            mostrarNotificacion(`Error al buscar estudiante: ${error.message}`, 'error');
        }
    }

    
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