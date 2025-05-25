// 1. Formulario de Creación de Asignatura
document.getElementById('create-subject-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const subjectData = {
        codigo: document.getElementById('subject-code').value,
        nombre: document.getElementById('subject-name').value,
        semestre: document.getElementById('subject-semester').value,
        creditos: document.getElementById('subject-credits').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/asignaturas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subjectData)
        });
        const data = await response.json();
        console.log("Asignatura creada:", data);
        alert("Asignatura creada exitosamente!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error al crear la asignatura");
    }
});

// 2. Formulario de Registro de Estudiante
document.getElementById('register-student-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentData = {
        asignatura: document.getElementById('register-subject').value,
        grupo: document.getElementById('register-group').value,
        semestre: document.getElementById('register-semester').value,
        dni: document.getElementById('register-dni').value,
        nombre: document.getElementById('register-name').value,
        apellidos: document.getElementById('register-lastname').value,
        email: document.getElementById('register-email').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/estudiantes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        const data = await response.json();
        console.log("Estudiante registrado:", data);
        alert("Estudiante registrado exitosamente!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error al registrar el estudiante");
    }
});