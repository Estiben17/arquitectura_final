// BACKEND/Service/departamentoService.js

// =======================================================================================
// ADVERTENCIA: NO IMPORTAR firebase/app NI firebase/firestore AQUI
// NO DEBE HABER 'firebaseConfig', 'initializeApp', 'getFirestore', 'collection', 'doc', etc.
// ESTE ARCHIVO RECIBE 'db' DEL SDK ADMIN.
// =======================================================================================

export default function createDepartamentoService(db, auth) { // 'db' es la instancia de Firestore del Admin SDK

    /**
     * Servicio para gestión de departamentos (para el backend)
     */
    const obtenerDepartamentos = async (filtros = {}) => {
        try {
            let q = db.collection('departamentos');

            if (filtros.estado && filtros.estado !== 'all') {
                q = q.where("estado", "==", filtros.estado);
            }

            if (filtros.busqueda) {
                q = q.where("nombre", ">=", filtros.busqueda)
                     .where("nombre", "<=", filtros.busqueda + '\uf8ff');
            }

            const querySnapshot = await q.get();
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                fechaCreacion: doc.data().fechaCreacion ? doc.data().fechaCreacion.toDate().toISOString() : null,
                fechaActualizacion: doc.data().fechaActualizacion ? doc.data().fechaActualizacion.toDate().toISOString() : null,
            }));
        } catch (error) {
            console.error("Error en obtenerDepartamentos (backend service):", error);
            throw new Error(`Error al obtener departamentos: ${error.message}`);
        }
    };

    const obtenerDepartamentoPorId = async (id) => {
        try {
            const docRef = db.collection("departamentos").doc(id);
            const docSnap = await docRef.get();

            if (docSnap.exists) {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    fechaCreacion: data.fechaCreacion ? data.fechaCreacion.toDate().toISOString() : null,
                    fechaActualizacion: data.fechaActualizacion ? data.fechaActualizacion.toDate().toISOString() : null,
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error en obtenerDepartamentoPorId (backend service):", error);
            throw new Error(`Error al obtener departamento: ${error.message}`);
        }
    };

    const actualizarDepartamento = async (id, nuevosDatos) => {
        try {
            const docRef = db.collection("departamentos").doc(id);
            await docRef.update({
                ...nuevosDatos,
                fechaActualizacion: new Date()
            });
        } catch (error) {
            console.error("Error en actualizarDepartamento:", error);
            throw new Error(`Error al actualizar departamento: ${error.message}`);
        }
    };

    const obtenerEstadisticasDepartamento = async (idDepartamento) => {
        try {
            const estudiantesSnapshot = await db.collection('estudiantes')
                                                .where("idDepartamento", "==", idDepartamento)
                                                .get();

            const profesoresSnapshot = await db.collection('profesores')
                                                .where("idDepartamento", "==", idDepartamento)
                                                .get();

            const asignaturasSnapshot = await db.collection('asignaturas')
                                                .where("idDepartamento", "==", idDepartamento)
                                                .get();

            return {
                totalEstudiantes: estudiantesSnapshot.size,
                totalProfesores: profesoresSnapshot.size,
                totalAsignaturas: asignaturasSnapshot.size
            };
        } catch (error) {
            console.error("Error en obtenerEstadisticasDepartamento (backend service):", error);
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    };

    // NOTA: 'buscarEstudiantePorDocumento' es más propio del servicio de estudiantes.
    // Si necesitas esta función para el contexto de un departamento (ej. asignar un estudiante),
    // podrías considerar inyectar el servicio de estudiantes aquí o hacer una llamada explícita.
    // Por ahora, lo he eliminado de aquí para evitar la duplicación y mantener la separación de responsabilidades.


    // Retorna el objeto con los métodos del servicio
    return {
        obtenerDepartamentos,
        obtenerDepartamentoPorId,
        actualizarDepartamento,
        obtenerEstadisticasDepartamento,
        // buscarEstudiantePorDocumento // Eliminar de aquí si no se usa directamente para dep.
    };
}