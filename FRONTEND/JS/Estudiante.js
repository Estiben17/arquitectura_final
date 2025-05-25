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
    const response = await fetch('http://localhost:3000/documentTypes');
    docTypes = await response.json();
    const select = document.getElementById('document-type');
    select.innerHTML = '';
    docTypes.forEach(type => {
      docTypesMap[type.code] = type.name;
      const option = document.createElement('option');
      option.value = type.code;
      option.textContent = type.name;
      select.appendChild(option);
    });
  } catch (error) {
    showError('Error al cargar tipos de documento.');
  }
}

async function loadFaculties() {
  try {
    const response = await fetch('http://localhost:3000/faculties');
    faculties = await response.json();
    const select = document.getElementById('faculty');
    select.innerHTML = '';
    faculties.forEach(faculty => {
      facultiesMap[faculty.code] = faculty.name;
      const option = document.createElement('option');
      option.value = faculty.code;
      option.textContent = faculty.name;
      select.appendChild(option);
    });
  } catch (error) {
    showError('Error al cargar facultades.');
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
  tbody.innerHTML = '';
  filteredStudents.forEach(student => {
    const row = `
      <tr>
        <td>${student.id}</td>
        <td>${student.documentType}</td>
        <td>${student.documentNumber}</td>
        <td>${student.firstName}</td>
        <td>${student.secondName}</td>
        <td>${student.firstSurname}</td>
        <td>${student.secondSurname}</td>
        <td>${student.faculty}</td>
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
    const response = await fetch(`http://localhost:3000/students?_page=${page}&_limit=${pageSize}`);
    students = await response.json();
    totalStudents = parseInt(response.headers.get('X-Total-Count'), 10);
    currentPage = page;
    renderStudentsTable();
    renderPagination();
  } catch (error) {
    showError('Error al cargar los estudiantes.');
  }
}

function showModal() {
  document.getElementById('student-modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('student-modal').style.display = 'none';
  resetStudentForm();
}

function resetStudentForm() {
  const form = document.getElementById('student-form');
  form.reset();
  editingStudentId = null;
  form.querySelectorAll('select').forEach(select => select.value = '');
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

document.getElementById('add-student-btn').addEventListener('click', showModal);
document.getElementById('close-modal').addEventListener('click', closeModal);

document.getElementById('student-form').addEventListener('submit', async function (event) {
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
      await fetch(`http://localhost:3000/students/${editingStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      showSuccess('Estudiante actualizado correctamente');
    } else {
      await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      showSuccess('Estudiante agregado correctamente');
    }

    closeModal();
    loadStudents(currentPage);
  } catch (error) {
    showError('Error al guardar el estudiante.');
  }
});

document.getElementById('students-table-body').addEventListener('click', (e) => {
  const editBtn = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');
  if (editBtn) editStudent(editBtn.dataset.id);
  if (deleteBtn) deleteStudent(deleteBtn.dataset.id);
});

async function editStudent(id) {
  try {
    const response = await fetch(`http://localhost:3000/students/${id}`);
    const student = await response.json();

    const form = document.getElementById('student-form');
    form['document-type'].value = student.documentType;
    form['document-number'].value = student.documentNumber;
    form['first-name'].value = student.firstName;
    form['second-name'].value = student.secondName;
    form['first-surname'].value = student.firstSurname;
    form['second-surname'].value = student.secondSurname;
    form['faculty'].value = student.faculty;

    editingStudentId = id;
    showModal();
  } catch (error) {
    showError('Error al cargar los datos del estudiante.');
  }
}

async function deleteStudent(id) {
  try {
    await fetch(`http://localhost:3000/students/${id}`, { method: 'DELETE' });
    showSuccess('Estudiante eliminado correctamente');
    loadStudents(currentPage);
  } catch (error) {
    showError('Error al eliminar el estudiante.');
  }
}

document.getElementById('search').addEventListener('input', handleSearch);

function handleSearch() {
  const searchTerm = this.value.trim().toLowerCase();
  if (!searchTerm) {
    loadStudents(currentPage);
    return;
  }

  const filteredStudents = students.filter(student =>
    Object.values(student).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm)
    )
  );

  renderStudentsTable(filteredStudents);
}

window.onload = async () => {
  await loadDocumentTypes();
  await loadFaculties();
  await loadStudents();
};
