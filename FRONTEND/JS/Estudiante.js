// FRONTEND/JS/Estudiante.js

import apiClient from './apiClient.js';

let students = [];
let docTypes = [];
let faculties = [];
let currentPage = 1;
const pageSize = 5;
let totalStudents = 0;
let editingStudentId = null;

let docTypesMap = {};
let facultiesMap = {};

async function loadDocumentTypes() {
    try {
        docTypes = await apiClient.loadDocumentTypes();
        const select = document.getElementById('document-type');
        const filterSelect = document.getElementById('filter-document-type'); // Para el filtro
        
        if (select) select.innerHTML = '<option value="" disabled selected>Seleccione un tipo de documento</option>';
        if (filterSelect) filterSelect.innerHTML = '<option value="">Todos</option>';

        docTypes.forEach(type => {
            docTypesMap[type.code] = type.name;
            const option = document.createElement('option');
            option.value = type.code;
            option.textContent = type.name;
            if (select) select.appendChild(option.cloneNode(true));
            if (filterSelect) filterSelect.appendChild(option.cloneNode(true)); // Añadir también al filtro
        });
    } catch (error) {
        showError('Error al cargar tipos de documento.');
        console.error('Error al cargar tipos de documento:', error);
    }
}

async function loadFaculties() {
    try {
        faculties = await apiClient.loadFaculties();
        const select = document.getElementById('faculty');
        const filterSelect = document.getElementById('filter-faculty'); // Para el filtro

        if (select) select.innerHTML = '<option value="" disabled selected>Seleccione una facultad</option>';
        if (filterSelect) filterSelect.innerHTML = '<option value="">Todos</option>';

        faculties.forEach(faculty => {
            facultiesMap[faculty.code] = faculty.name;
            const option = document.createElement('option');
            option.value = faculty.code;
            option.textContent = faculty.name;
            if (select) select.appendChild(option.cloneNode(true));
            if (filterSelect) filterSelect.appendChild(option.cloneNode(true)); // Añadir también al filtro
        });
    } catch (error) {
        showError('Error al cargar facultades.');
        console.error('Error al cargar facultades:', error);
    }
}

function getDocumentTypeName(code) {
    return docTypesMap[code] || code;
}

function getFacultyName(code) {
    return facultiesMap[code] || code;
}

function renderStudentsTable(filteredStudents = students) {
    const tbody = document.getElementById('students-table-body');
    if (!tbody) {
        console.error('students-table-body no encontrado.');
        return;
    }
    tbody.innerHTML = '';
    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No se encontraron estudiantes.</td></tr>';
        return;
    }

    filteredStudents.forEach(student => {
        // Usar los nombres de propiedades EXACTOS de Firestore
        const fullName = `${student.nombre || ''} ${student.apellido || ''}`.trim();
        const documentType = getDocumentTypeName(student['tipo de documento']) || 'N/A';
        const documentNumber = student['numero de documento'] || 'N/A';
        const facultyName = getFacultyName(student.facultad) || 'N/A';
        const studentId = student.id; 

        const row = `
            <tr>
                <td>${fullName}</td>
                <td>${documentType}</td>
                <td>${documentNumber}</td>
                <td>${facultyName}</td>
                <td>
                    <button class="btn-action btn-edit" data-id="${studentId}" aria-label="Editar estudiante"><i class="fas fa-edit"></i></button>
                    <button class="btn-action btn-delete" data-id="${studentId}" aria-label="Eliminar estudiante"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>`;
        tbody.innerHTML += row;
    });

    // Añadir event listeners después de que las filas se hayan renderizado
    tbody.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', (e) => editStudent(e.currentTarget.dataset.id));
    });
    tbody.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (e) => deleteStudent(e.currentTarget.dataset.id));
    });
}

function renderPagination() {
    const totalPages = Math.ceil(totalStudents / pageSize);
    const pagination = document.getElementById('pagination');
    const pageInfoSpan = document.getElementById('page-info');
    const prevButton = document.getElementById('btn-prev-page');
    const nextButton = document.getElementById('btn-next-page');

    if (!pagination || !pageInfoSpan || !prevButton || !nextButton) {
        console.error('Elementos de paginación no encontrados.');
        return;
    }
    
    // Limpiar paginación actual
    pagination.innerHTML = ''; 

    // Añadir botones de paginación numérica
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('btn-pagination');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => loadStudents(i));
        pagination.appendChild(button);
    }
    
   
}


async function loadStudents(page = 1) {
    try {
        const response = await apiClient.obtenerEstudiantes(page, pageSize);
        students = response.students;
        totalStudents = response.totalCount;
        currentPage = page;
        renderStudentsTable();
        renderPagination();
    } catch (error) {
        showError('Error al cargar los estudiantes.');
        console.error('Error al cargar los estudiantes:', error);
    }
}

function showModal(modalId = 'student-modal') {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        // Quita aria-hidden cuando el modal se muestra
        modal.setAttribute('aria-hidden', 'false'); 
    } else {
        console.error(`Modal con ID ${modalId} no encontrado.`);
    }
}

function closeModal(modalId = 'student-modal') {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // Vuelve a añadir aria-hidden cuando el modal se oculta
        modal.setAttribute('aria-hidden', 'true');
        resetStudentForm();
    }
}

function resetStudentForm() {
    const form = document.getElementById('student-form');
    if (form) {
        form.reset();
        editingStudentId = null;
        // Restablecer el valor de los selects a su opción por defecto
        form.querySelectorAll('select').forEach(select => {
            select.value = '';
            // Si el select tiene una opción deshabilitada seleccionada por defecto, úsala
            const defaultOption = select.querySelector('option[disabled][selected]');
            if (defaultOption) {
                select.value = defaultOption.value;
            }
        });
        document.getElementById('modal-title').textContent = 'Nuevo Estudiante'; // Restablecer el título
    }
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const addStudentBtn = document.getElementById('add-student-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const studentForm = document.getElementById('student-form');
    const studentsTableBody = document.getElementById('students-table-body');
    const searchInput = document.getElementById('search');

    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            editingStudentId = null;
            resetStudentForm();
            showModal();
        });
    }
    
    // También el botón de cerrar modal dentro del contenido
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    if (studentForm) {
        studentForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const form = event.target;

            // AJUSTE CLAVE: Nombres de los campos del formulario deben coincidir EXACTAMENTE con Firestore
            const studentData = {
                'tipo de documento': form['document-type'].value,
                'numero de documento': form['document-number'].value.trim(),
                'nombre': form['first-name'].value.trim(),
                // Asegúrate de enviar secondName y secondSurname si los manejas en Firestore
                'segundo nombre': form['second-name'].value.trim(), // Si tienes este campo en Firestore
                'apellido': form['first-surname'].value.trim(),
                'segundo apellido': form['second-surname'].value.trim(), // Si tienes este campo en Firestore
                'facultad': form['faculty'].value,
                'programa': form['program'].value.trim(),
                'Fecha Nacimiento': form['birth-date'].value, // Date en formato YYYY-MM-DD
                'Género': form['gender'].value,
                'Semestre': parseInt(form['semester'].value, 10) || null, // Convertir a número
                'Promedio': parseFloat(form['average'].value) || null, // Convertir a número
                'Email': form['email'].value.trim(),
                'Teléfono': form['phone'].value.trim(),
                'Direccion': form['address'].value.trim(),
                'estado': form['status'].value,
                'fechaCreacion': new Date().toISOString() // Añadir fecha de creación
            };

            // Validaciones básicas antes de enviar
            if (!studentData['numero de documento'] || !studentData['nombre'] || !studentData['apellido'] || !studentData['facultad'] || !studentData['tipo de documento']) {
                showError('Los campos obligatorios son: Nombre, Apellido, Tipo y Número de Documento, y Facultad.');
                return;
            }

            try {
                if (editingStudentId) {
                    await apiClient.actualizarEstudiante(editingStudentId, studentData);
                    showSuccess('Estudiante actualizado correctamente');
                } else {
                    await apiClient.crearEstudiante(studentData);
                    showSuccess('Estudiante agregado correctamente');
                }

                closeModal();
                loadStudents(currentPage);
            } catch (error) {
                // El error ya viene formateado desde el backend si es un 400
                const errorMessage = error.message || 'Error al guardar el estudiante.';
                showError(errorMessage);
                console.error('Error al guardar el estudiante:', error);
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', handleSearch);

    // Initial load
    (async () => {
        await loadDocumentTypes();
        await loadFaculties();
        await loadStudents();
    })();
});

async function editStudent(id) {
    try {
        const student = await apiClient.obtenerEstudiantePorId(id);
        console.log('Datos del estudiante para editar:', student); // Para depuración

        const form = document.getElementById('student-form');
        if (form && student) {
            // AJUSTE CLAVE: Precargar los campos del formulario con los nombres EXACTOS de Firestore
            form['document-type'].value = student['tipo de documento'] || '';
            form['document-number'].value = student['numero de documento'] || '';
            form['first-name'].value = student.nombre || '';
            form['second-name'].value = student['segundo nombre'] || ''; // Si tienes este campo en Firestore
            form['first-surname'].value = student.apellido || '';
            form['second-surname'].value = student['segundo apellido'] || ''; // Si tienes este campo en Firestore
            form['faculty'].value = student.facultad || '';
            form['program'].value = student.programa || '';
            
          
            let birthDate = '';
            if (student['Fecha Nacimiento']) {
                // Suponiendo que Fecha Nacimiento es un objeto Timestamp de Firestore
                if (student['Fecha Nacimiento'] instanceof Date) {
                    birthDate = student['Fecha Nacimiento'].toISOString().split('T')[0];
                } else if (student['Fecha Nacimiento'] && student['Fecha Nacimiento'].toDate) { // Si es un Timestamp de Firestore
                    birthDate = student['Fecha Nacimiento'].toDate().toISOString().split('T')[0];
                } else if (typeof student['Fecha Nacimiento'] === 'string') { // Si ya es un string ISO
                    birthDate = student['Fecha Nacimiento'].split('T')[0];
                }
            }
            form['birth-date'].value = birthDate;

            form['gender'].value = student['Género'] || '';
            form['semester'].value = student['Semestre'] || '';
            form['average'].value = student['Promedio'] || '';
            form['email'].value = student['Email'] || '';
            form['phone'].value = student['Teléfono'] || '';
            form['address'].value = student['Direccion'] || '';
            form['status'].value = student.estado || 'Activo'; // Valor por defecto si no existe

            editingStudentId = id;
            document.getElementById('modal-title').textContent = 'Editar Estudiante';
            showModal();
        } else {
            showError('Estudiante no encontrado o formulario no disponible.');
        }
    } catch (error) {
        showError('Error al cargar los datos del estudiante para edición.');
        console.error('Error al cargar los datos del estudiante para edición:', error);
    }
}

async function deleteStudent(id) {
    if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) {
        return;
    }
    try {
        await apiClient.eliminarEstudiante(id);
        showSuccess('Estudiante eliminado correctamente');
        loadStudents(currentPage);
    } catch (error) {
        showError('Error al eliminar el estudiante.');
        console.error('Error al eliminar el estudiante:', error);
    }
}

function handleSearch() {
    const searchTerm = this.value.trim().toLowerCase();
    if (!searchTerm) {
        loadStudents(currentPage);
        return;
    }

    const filteredStudents = students.filter(student =>
        (student.nombre && student.nombre.toLowerCase().includes(searchTerm)) ||
        (student.apellido && student.apellido.toLowerCase().includes(searchTerm)) ||
        (student['numero de documento'] && student['numero de documento'].toLowerCase().includes(searchTerm)) ||
        (student['segundo nombre'] && student['segundo nombre'].toLowerCase().includes(searchTerm)) ||
        (student['segundo apellido'] && student['segundo apellido'].toLowerCase().includes(searchTerm))
    );

    renderStudentsTable(filteredStudents);
}
