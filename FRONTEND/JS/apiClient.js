// FRONTEND/JS/apiClient.js

const API_BASE_URL = 'http://localhost:3000/api'; // Asegúrate de que esta URL sea correcta

const apiClient = {
    // --- Métodos para Asistencias ---
    crearAsistencia: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/asistencias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear asistencia');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.crearAsistencia:", error);
            throw error;
        }
    },
    obtenerAsistencias: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/asistencias`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener asistencias');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.obtenerAsistencias:", error);
            throw error;
        }
    },
    obtenerAsistenciaPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/asistencias/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener asistencia por ID');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.obtenerAsistenciaPorId:", error);
            throw error;
        }
    },
    actualizarAsistencia: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/asistencias/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar asistencia');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.actualizarAsistencia:", error);
            throw error;
        }
    },
    eliminarAsistencia: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/asistencias/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar asistencia');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.eliminarAsistencia:", error);
            throw error;
        }
    },

    // --- Métodos para Departamentos ---
    obtenerDepartamentos: async (filtros = {}) => {
        try {
            const params = new URLSearchParams(filtros).toString();
            const response = await fetch(`${API_BASE_URL}/departamentos?${params}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener departamentos');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.obtenerDepartamentos:", error);
            throw error;
        }
    },
    obtenerDepartamentoPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/departamentos/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener departamento por ID');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.obtenerDepartamentoPorId:", error);
            throw error;
        }
    },
    actualizarDepartamento: async (id, datos) => {
        try {
            const response = await fetch(`${API_BASE_URL}/departamentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar departamento');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.actualizarDepartamento:", error);
            throw error;
        }
    },
    obtenerEstadisticasDepartamento: async (idDepartamento) => {
        try {
            const response = await fetch(`${API_BASE_URL}/departamentos/${idDepartamento}/estadisticas`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener estadísticas del departamento');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.obtenerEstadisticasDepartamento:", error);
            throw error;
        }
    },

    // --- Métodos para Estudiantes (NUEVOS) ---
    crearEstudiante: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear estudiante');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.crearEstudiante:", error);
            throw error;
        }
    },
    obtenerEstudiantes: async (page = 1, pageSize = 5) => {
        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes?_page=${page}&_limit=${pageSize}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener estudiantes');
            }
            // Cuando se obtienen estudiantes, también se necesita el total para paginación
            const totalCount = response.headers.get('X-Total-Count'); // Asegúrate de que tu backend envíe este header
            const studentsData = await response.json();
            return {
                students: studentsData,
                totalCount: totalCount ? parseInt(totalCount, 10) : studentsData.length // Fallback por si no viene el header
            };
        } catch (error) {
            console.error("Error en apiClient.obtenerEstudiantes:", error);
            throw error;
        }
    },
    obtenerEstudiantePorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener estudiante por ID');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.obtenerEstudiantePorId:", error);
            throw error;
        }
    },
    actualizarEstudiante: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar estudiante');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.actualizarEstudiante:", error);
            throw error;
        }
    },
    eliminarEstudiante: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar estudiante');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.eliminarEstudiante:", error);
            throw error;
        }
    },
    buscarEstudiantePorDocumento: async (tipoDocumento, numeroDocumento) => {
        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes/buscar-documento?tipo=${tipoDocumento}&numero=${numeroDocumento}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al buscar estudiante por documento');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.buscarEstudiantePorDocumento:", error);
            throw error;
        }
    },

    // --- Métodos para Tipos de Documento y Facultades (NUEVOS) ---
    loadDocumentTypes: async () => {
        try {
            // Asumo que tienes una ruta para esto, si no, deberás crearla en el backend
            const response = await fetch(`${API_BASE_URL}/documentTypes`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cargar tipos de documento');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.loadDocumentTypes:", error);
            throw error;
        }
    },
    loadFaculties: async () => {
        try {
            // Asumo que tienes una ruta para esto, si no, deberás crearla en el backend
            const response = await fetch(`${API_BASE_URL}/facultades`); // O /faculties, usa la que corresponda
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cargar facultades');
            }
            return await response.json();
        } catch (error) {
            console.error("Error en apiClient.loadFaculties:", error);
            throw error;
        }
    },

    // --- Puedes añadir aquí métodos para Asignaturas si los necesitas en este mismo archivo ---
    // ...
};

export default apiClient;