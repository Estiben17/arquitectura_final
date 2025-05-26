// BACKEND/Service/asistenciaService.js (¡MUY IMPORTANTE: ESTE ES EL SERVICIO DEL BACKEND!)

// =======================================================================================
// ADVERTENCIA: NO IMPORTAR firebase/app NI firebase/firestore AQUI
// NO DEBE HABER 'firebaseConfig', 'initializeApp', 'getFirestore', 'collection', 'doc', etc.
// ESTE ARCHIVO RECIBE 'db' DEL SDK ADMIN.
// =======================================================================================

// Importa 'admin' si necesitas usar FieldValue.serverTimestamp() o admin.firestore.Timestamp
// Asegúrate de que 'admin' se exporte desde BACKEND/firebase.js
// Si solo usas new Date(), no necesitas importar 'admin' aquí.
// import { admin } from '../firebase.js'; // Descomenta si usas admin.firestore.FieldValue.serverTimestamp()

// =======================================================================================
// PASO CLAVE: Exporta una FUNCIÓN que "crea" tu servicio y RECIBE 'db' y 'auth'
export default function createAsistenciaService(db, auth) { // 'db' es la instancia de Firestore del Admin SDK

    // Ya no necesitas 'asistenciasCollection' ni 'estudiantesCollection' globales
    // porque 'db' es ahora la instancia de Firestore del Admin SDK
    // y accedes a las colecciones con db.collection('nombre_coleccion')

    /**
     * Servicio para gestión de asistencias (para el backend)
     */
    const crearAsistencia = async (datosAsistencia) => {
        try {
            // Validación de datos requeridos
            if (!datosAsistencia.idAsignatura || !datosAsistencia.fecha) {
                throw new Error("Asignatura y fecha son campos obligatorios");
            }

            // Convertir fecha a Timestamp de Firebase Admin
            // Admin SDK trabaja bien con objetos Date de JS, o con admin.firestore.Timestamp
            const asistenciaData = {
                ...datosAsignatura,
                // Si la fecha llega como string, conviértela a Date. Firestore Admin la manejará como Timestamp.
                fecha: new Date(datosAsistencia.fecha),
                horaInicio: datosAsistencia.horaInicio || null,
                horaFin: datosAsistencia.horaFin || null,
                estudiantes: datosAsistencia.estudiantes || [],
                fechaCreacion: new Date() // Usar objeto Date() o admin.firestore.FieldValue.serverTimestamp()
            };

            // Usa la instancia 'db' (del Admin SDK) para acceder a la colección y añadir un documento
            const docRef = await db.collection('asistencias').add(asistenciaData);

            return {
                id: docRef.id,
                ...asistenciaData
            };
        } catch (error) {
            console.error("Error en crearAsistencia (backend service):", error);
            throw new Error(`Error al crear asistencia: ${error.message}`);
        }
    };

    const obtenerAsistencias = async (filtros = {}) => {
        try {
            // Construir consulta con filtros
            let q = db.collection('asistencias'); // Inicia la consulta desde la instancia db del Admin SDK

            if (filtros.idAsignatura && filtros.idAsignatura !== 'all') {
                q = q.where("idAsignatura", "==", filtros.idAsignatura);
            }

            if (filtros.grupo && filtros.grupo !== 'all') {
                q = q.where("grupo", "==", filtros.grupo);
            }

            if (filtros.semestre && filtros.semestre !== 'all') {
                q = q.where("semestre", "==", filtros.semestre);
            }

            // Convertir fechas a objetos Date para comparación con Firestore Admin SDK
            if (filtros.fechaDesde) {
                q = q.where("fecha", ">=", new Date(filtros.fechaDesde));
            }

            if (filtros.fechaHasta) {
                q = q.where("fecha", "<=", new Date(filtros.fechaHasta));
            }

            const querySnapshot = await q.get(); // Ejecuta la consulta

            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Convertir Timestamp a fecha legible
                    // Los Timestamps del Admin SDK tienen un método .toDate()
                    fecha: data.fecha ? data.fecha.toDate().toLocaleDateString() : null, // Verifica si 'fecha' existe
                    horaInicio: data.horaInicio || '--:--',
                    horaFin: data.horaFin || '--:--'
                };
            });
        } catch (error) {
            console.error("Error en obtenerAsistencias (backend service):", error);
            throw new Error(`Error al obtener asistencias: ${error.message}`);
        }
    };

    const registrarAsistenciaEstudiante = async (idAsistencia, datosEstudiante) => {
        try {
            // Usa la instancia 'db' (del Admin SDK) para acceder al documento
            const asistenciaRef = db.collection("asistencias").doc(idAsistencia);

            // Primero obtenemos el documento actual
            const docSnapshot = await asistenciaRef.get();

            if (!docSnapshot.exists) {
                throw new Error("Registro de asistencia no encontrado.");
            }

            const estudiantes = docSnapshot.data().estudiantes || [];

            // Verificamos si el estudiante ya está registrado
            const index = estudiantes.findIndex(e => e.idEstudiante === datosEstudiante.idEstudiante);

            if (index >= 0) {
                // Actualizar registro existente
                estudiantes[index] = datosEstudiante;
            } else {
                // Agregar nuevo registro
                estudiantes.push(datosEstudiante);
            }

            // Actualizar el documento
            await asistenciaRef.update({
                estudiantes,
                fechaActualizacion: new Date() // Usar objeto Date() o admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error en registrarAsistenciaEstudiante:", error);
            throw new Error(`Error al registrar asistencia: ${error.message}`);
        }
    };

    const obtenerEstudiantesParaAsistencia = async (idAsignatura, grupo) => {
        try {
            // Inicia la consulta desde la instancia db del Admin SDK
            let q = db.collection('estudiantes');

            const querySnapshot = await q
                .where("asignaturas", "array-contains", idAsignatura)
                .where("grupo", "==", grupo)
                .get();

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error en obtenerEstudiantesParaAsistencia:", error);
            throw new Error(`Error al obtener estudiantes para asistencia: ${error.message}`);
        }
    };

    // Retorna el objeto con los métodos del servicio
    return {
        crearAsistencia,
        obtenerAsistencias,
        registrarAsistenciaEstudiante,
        obtenerEstudiantesParaAsistencia
    };
}