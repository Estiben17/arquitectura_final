import apiClient from './apiClient.js'; // CAMBIO CLAVE: Importa el nuevo cliente API

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
        // CAMBIO CLAVE: Usar apiClient
        docTypes = await apiClient.loadDocumentTypes();
        const select = document.getElementById('document-type');
        const selectEdit = document.getElementById('edit-document-type'); // Asumo un select para edición
        if (select) select.innerHTML = '';
        if (selectEdit) selectEdit.innerHTML = '';

        docTypes.forEach(type => {
            docTypesMap[type.code] = type.name;
            const option = document.createElement('option');
            option.value = type.code;
            option.textContent = type.name;
            if (select) select.appendChild(option.cloneNode(true));
            if (selectEdit) selectEdit.appendChild(option);
        });
    } catch (error) {
        showError('Error al cargar tipos de documento.');
        console.error('Error al cargar tipos de documento:', error);
    }
}

async function loadFaculties() {
    try {
        // CAMBIO CLAVE: Usar apiClient
        faculties = await apiClient.loadFaculties();
        const select = document.getElementById('faculty');
        const selectEdit = document.getElementById('edit-faculty'); // Asumo un select para edición
        if (select) select.innerHTML = '';
        if (selectEdit) selectEdit.innerHTML = '';

        faculties.forEach(faculty => {
            facultiesMap[faculty.code] = faculty.name;
            const option = document.createElement('option');
            option.value = faculty.code;
            option.textContent = faculty.name;
            if (select) select.appendChild(option.cloneNode(true));
            if (selectEdit) selectEdit.appendChild(option);
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
        tbody.innerHTML = '<tr><td colspan="9">No se encontraron estudiantes.</td></tr>';
        return;
    }

    filteredStudents.forEach(student => {
        const row = `
            <tr>
                <td>${student.id}</td>
                <td>${getDocumentTypeName(student.documentType)}</td>
                <td>${student.documentNumber}</td>
                <td>${student.firstName}</td>
                <td>${student.secondName || ''}</td>
                <td>${student.firstSurname}</td>
                <td>${student.secondSurname || ''}</td>
                <td>${getFacultyName(student.faculty)}</td>
                <td>
                    <button class="btn-action btn-edit" data-id="${student.id}" aria-label="Editar estudiante"><i class="fas fa-edit"></i></button>
                    <button class="btn-action btn-delete" data-id="${student.id}" aria-label="Eliminar estudiante"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>`;
        tbody.innerHTML += row;
    });
}

function renderPagination() {
    const totalPages = Math.ceil(totalStudents / pageSize);
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.error('pagination no encontrado.');
        return;
    }
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add(i === currentPage ? 'active' : '');
        button.addEventListener('click', () => loadStudents(i));
        pagination.appendChild(button);
    }
}

async function loadStudents(page = 1) {
    try {
        // CAMBIO CLAVE: Usar apiClient para obtener estudiantes
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
    } else {
        console.error(`Modal con ID ${modalId} no encontrado.`);
    }
}

function closeModal(modalId = 'student-modal') {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        resetStudentForm();
    }
}

function resetStudentForm() {
    const form = document.getElementById('student-form');
    if (form) {
        form.reset();
        editingStudentId = null;
        form.querySelectorAll('select').forEach(select => select.value = '');
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
    // Event listeners para el modal principal de creación/edición
    const addStudentBtn = document.getElementById('add-student-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const studentForm = document.getElementById('student-form');
    const studentsTableBody = document.getElementById('students-table-body');
    const searchInput = document.getElementById('search');

    if (addStudentBtn) addStudentBtn.addEventListener('click', showModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    if (studentForm) {
        studentForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const form = event.target;

            const studentData = {
                documentType: form['document-type'].value,
                documentNumber: form['document-number'].value.trim(),
                firstName: form['first-name'].value.trim(),
                secondName: form['second-name'].value.trim(),
                firstSurname: form['first-surname'].value.trim(),
                secondSurname: form['second-surname'].value.trim(),
                faculty: form['faculty'].value
            };

            if (!studentData.documentNumber || !studentData.firstName || !studentData.firstSurname || !studentData.faculty) {
                showError('Complete los campos obligatorios.');
                return;
            }

            try {
                if (editingStudentId) {
                    // CAMBIO CLAVE: Usar apiClient para actualizar estudiante
                    await apiClient.actualizarEstudiante(editingStudentId, studentData);
                    showSuccess('Estudiante actualizado correctamente');
                } else {
                    // CAMBIO CLAVE: Usar apiClient para crear estudiante
                    await apiClient.crearEstudiante(studentData);
                    showSuccess('Estudiante agregado correctamente');
                }

                closeModal();
                loadStudents(currentPage);
            } catch (error) {
                showError('Error al guardar el estudiante.');
                console.error('Error al guardar el estudiante:', error);
            }
        });
    }

    if (studentsTableBody) {
        studentsTableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-edit');
            const deleteBtn = e.target.closest('.btn-delete');
            if (editBtn) editStudent(editBtn.dataset.id);
            if (deleteBtn) deleteStudent(deleteBtn.dataset.id);
        });
    }

    if (searchInput) searchInput.addEventListener('input', handleSearch);

    // Initial load
    window.onload = async () => {
        await loadDocumentTypes();
        await loadFaculties();
        await loadStudents();
    };
});

async function editStudent(id) {
    try {
        // CAMBIO CLAVE: Usar apiClient para obtener estudiante por ID
        const student = await apiClient.obtenerEstudiantePorId(id);

        const form = document.getElementById('student-form');
        if (form) {
            form['document-type'].value = student.documentType;
            form['document-number'].value = student.documentNumber;
            form['first-name'].value = student.firstName;
            form['second-name'].value = student.secondName;
            form['first-surname'].value = student.firstSurname;
            form['second-surname'].value = student.secondSurname;
            form['faculty'].value = student.faculty;

            editingStudentId = id;
            showModal();
        }
    } catch (error) {
        showError('Error al cargar los datos del estudiante.');
        console.error('Error al cargar los datos del estudiante para edición:', error);
    }
}

async function deleteStudent(id) {
    if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) {
        return;
    }
    try {
        // CAMBIO CLAVE: Usar apiClient para eliminar estudiante
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
        loadStudents(currentPage); // Recargar la página actual para mostrar todos
        return;
    }

    // Esta búsqueda es client-side. Si quieres una búsqueda real en el backend,
    // necesitarías un endpoint de búsqueda en tu backend que filtre por el término.
    // Por ahora, funciona para los estudiantes cargados en la página actual.
    const filteredStudents = students.filter(student =>
        (student.firstName && student.firstName.toLowerCase().includes(searchTerm)) ||
        (student.secondName && student.secondName.toLowerCase().includes(searchTerm)) ||
        (student.firstSurname && student.firstSurname.toLowerCase().includes(searchTerm)) ||
        (student.secondSurname && student.secondSurname.toLowerCase().includes(searchTerm)) ||
        (student.documentNumber && student.documentNumber.toLowerCase().includes(searchTerm))
        // Puedes añadir más campos aquí para buscar
    );

    renderStudentsTable(filteredStudents);
}

// Asegúrate de que las funciones auxiliares como showError, showSuccess, showToast
// y los manejadores de modales estén definidos y accesibles.