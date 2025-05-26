// BACKEND/Service/departamentoService.js (¡MUY IMPORTANTE: ESTE ES EL SERVICIO DEL BACKEND!)

// =======================================================================================
// ADVERTENCIA: NO IMPORTAR firebase/app NI firebase/firestore AQUI
// NO DEBE HABER 'firebaseConfig', 'initializeApp', 'getFirestore', 'collection', 'doc', etc.
// ESTE ARCHIVO RECIBE 'db' DEL SDK ADMIN.
// =======================================================================================

// Si necesitas usar admin.firestore.FieldValue.serverTimestamp(), importa 'admin'
// import { admin } from '../firebase.js'; // Descomenta si usas admin.firestore.FieldValue.serverTimestamp()

// =======================================================================================
// PASO CLAVE: Exporta una FUNCIÓN que "crea" tu servicio y RECIBE 'db' y 'auth'
export default function createDepartamentoService(db, auth) { // 'db' es la instancia de Firestore del Admin SDK

    // Ya no necesitas 'departamentosCollection', 'estudiantesCollection', etc. globales
    // porque 'db' es la instancia de Firestore del Admin SDK
    // y accedes a las colecciones con db.collection('nombre_coleccion')

    /**
     * Servicio para gestión de departamentos (para el backend)
     */
    const obtenerDepartamentos = async (filtros = {}) => {
        try {
            let q = db.collection('departamentos'); // Inicia la consulta desde la instancia db del Admin SDK

            if (filtros.estado && filtros.estado !== 'all') {
                q = q.where("estado", "==", filtros.estado);
            }

            if (filtros.busqueda) {
                // Para búsquedas de prefijo, Firestore necesita un rango.
                // Considera usar un campo 'searchKeywords' como en estudiante, o soluciones de búsqueda full-text.
                // Esta es una búsqueda básica de "empieza con".
                q = q.where("nombre", ">=", filtros.busqueda)
                     .where("nombre", "<=", filtros.busqueda + '\uf8ff');
            }

            const querySnapshot = await q.get(); // Ejecuta la consulta
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error en obtenerDepartamentos (backend service):", error);
            throw new Error(`Error al obtener departamentos: ${error.message}`);
        }
    };

    const obtenerDepartamentoPorId = async (id) => {
        try {
            // Usa la instancia 'db' (del Admin SDK) para acceder al documento
            const docRef = db.collection("departamentos").doc(id);
            const docSnap = await docRef.get(); // Ejecuta la obtención del documento

            if (docSnap.exists) { // 'exists' es una propiedad booleana
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null; // Retorna null si no se encuentra, en lugar de lanzar error aquí
                // El controlador puede decidir si es 404 o lanzar un error específico
            }
        } catch (error) {
            console.error("Error en obtenerDepartamentoPorId (backend service):", error);
            throw new Error(`Error al obtener departamento: ${error.message}`);
        }
    };

    const actualizarDepartamento = async (id, nuevosDatos) => {
        try {
            // Usa la instancia 'db' (del Admin SDK) para acceder al documento
            const docRef = db.collection("departamentos").doc(id);
            await docRef.update({
                ...nuevosDatos,
                fechaActualizacion: new Date() // Usar objeto Date() o admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error en actualizarDepartamento (backend service):", error);
            throw new Error(`Error al actualizar departamento: ${error.message}`);
        }
    };

    const obtenerEstadisticasDepartamento = async (idDepartamento) => {
        try {
            // Obtener estudiantes del departamento
            const estudiantesSnapshot = await db.collection('estudiantes')
                                                .where("idDepartamento", "==", idDepartamento)
                                                .get();

            // Obtener profesores del departamento
            const profesoresSnapshot = await db.collection('profesores')
                                                .where("idDepartamento", "==", idDepartamento)
                                                .get();

            // Obtener asignaturas del departamento
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

    const buscarEstudiantePorDocumento = async (tipoDocumento, numeroDocumento) => {
        try {
            // Asumiendo que el campo en Firestore es 'numeroDocumento' y 'tipoDocumento'
            const q = db.collection('estudiantes')
                        .where("tipoDocumento", "==", tipoDocumento)
                        .where("numeroDocumento", "==", numeroDocumento)
                        .limit(1); // Limitar a 1 resultado si el documento es único

            const querySnapshot = await q.get();

            if (querySnapshot.empty) {
                return null;
            }

            return {
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data()
            };
        } catch (error) {
            console.error("Error en buscarEstudiantePorDocumento (backend service):", error);
            throw new Error(`Error al buscar estudiante por documento: ${error.message}`);
        }
    };

    // Retorna el objeto con los métodos del servicio
    return {
        obtenerDepartamentos,
        obtenerDepartamentoPorId, // Asegúrate de que el controlador llama a este método
        actualizarDepartamento,
        obtenerEstadisticasDepartamento, // Renombrado para claridad con el controlador anterior
        buscarEstudiantePorDocumento
    };
}