// BACKEND/Service/estudianteService.js (¡MUY IMPORTANTE: ESTE ES EL SERVICIO DEL BACKEND!)

// =======================================================================================
// ADVERTENCIA: NO IMPORTAR firebase/app NI firebase/firestore AQUI
// NO DEBE HABER 'firebaseConfig', 'initializeApp', 'getFirestore', 'collection', 'doc', etc.
// ESTE ARCHIVO RECIBE 'db' DEL SDK ADMIN.
// =======================================================================================

// Si necesitas usar admin.firestore.FieldValue.serverTimestamp(), importa 'admin'
// import { admin } from '../firebase.js'; // Descomenta si usas admin.firestore.FieldValue.serverTimestamp()

// =======================================================================================
// PASO CLAVE: Exporta una FUNCIÓN que "crea" tu servicio y RECIBE 'db' y 'auth'
export default function createEstudianteService(db, auth) { // 'db' es la instancia de Firestore del Admin SDK

    /**
     * Servicio para gestión de estudiantes (para el backend)
     */

    /**
     * Crea un nuevo registro de estudiante.
     * @param {Object} datosEstudiante - Datos del estudiante a crear.
     * @returns {Promise<Object>} Estudiante creado con su ID.
     */
    const crearEstudiante = async (datosEstudiante) => {
        try {
            // Validación de datos requeridos (ejemplo)
            if (!datosEstudiante.nombre || !datosEstudiante.apellido || !datosEstudiante.numeroDocumento) {
                throw new Error("Nombre, apellido y número de documento son campos obligatorios para el estudiante.");
            }

            const estudianteData = {
                ...datosEstudiante,
                fechaCreacion: new Date(), // Usar objeto Date() o admin.firestore.FieldValue.serverTimestamp()
                fechaActualizacion: new Date(),
                // Puedes añadir campos adicionales como 'estado: "activo"', 'asignaturas: []' aquí
                estado: datosEstudiante.estado || "activo", // Por defecto 'activo'
                asignaturas: datosEstudiante.asignaturas || [] // Array para IDs de asignaturas
            };

            const docRef = await db.collection('estudiantes').add(estudianteData);

            // También podrías crear un usuario de Firebase Authentication si lo necesitas
            // const userRecord = await auth.createUser({
            //     email: datosEstudiante.email,
            //     password: datosEstudiante.password, // Solo si lo manejas directamente aquí
            //     displayName: `${datosEstudiante.nombre} ${datosEstudiante.apellido}`,
            // });
            // console.log('Successfully created new user:', userRecord.uid);
            // await db.collection('estudiantes').doc(docRef.id).update({ uid: userRecord.uid });


            return {
                id: docRef.id,
                ...estudianteData
            };
        } catch (error) {
            console.error("Error en crearEstudiante (backend service):", error);
            // Si el error es por email duplicado en Auth, puedes manejarlo específicamente
            if (error.code === 'auth/email-already-exists') {
                throw new Error("El correo electrónico ya está registrado.");
            }
            throw new Error(`Error al crear estudiante: ${error.message}`);
        }
    };

    /**
     * Obtiene todos los estudiantes con filtros opcionales.
     * @param {Object} filtros - Objeto con filtros de búsqueda (ej. idDepartamento, grupo, estado, busqueda por nombre/documento).
     * @returns {Promise<Array>} Lista de estudiantes.
     */
    const obtenerEstudiantes = async (filtros = {}) => {
        try {
            let q = db.collection('estudiantes');

            if (filtros.idDepartamento && filtros.idDepartamento !== 'all') {
                q = q.where("idDepartamento", "==", filtros.idDepartamento);
            }
            if (filtros.grupo && filtros.grupo !== 'all') {
                q = q.where("grupo", "==", filtros.grupo);
            }
            if (filtros.estado && filtros.estado !== 'all') {
                q = q.where("estado", "==", filtros.estado);
            }
            if (filtros.tipoDocumento && filtros.tipoDocumento !== 'all') {
                q = q.where("tipoDocumento", "==", filtros.tipoDocumento);
            }

            // Búsqueda por nombre o documento (ejemplo de búsqueda parcial si los campos son strings)
            if (filtros.busqueda) {
                // Puedes buscar en nombre completo o número de documento
                // Nota: Firestore no soporta "OR" queries directas entre diferentes campos sin una colección de unión o desnormalización.
                // Si la búsqueda es por nombre, es un rango:
                q = q.where("nombreCompleto", ">=", filtros.busqueda) // Asumiendo un campo 'nombreCompleto' concatenado
                     .where("nombreCompleto", "<=", filtros.busqueda + '\uf8ff');
                // O si buscas por número de documento:
                // q = q.where("numeroDocumento", "==", filtros.busqueda); // Esto sería una búsqueda exacta
            }

            const querySnapshot = await q.get();
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                fechaCreacion: doc.data().fechaCreacion ? doc.data().fechaCreacion.toDate().toLocaleDateString() : null,
                fechaActualizacion: doc.data().fechaActualizacion ? doc.data().fechaActualizacion.toDate().toLocaleDateString() : null,
            }));
        } catch (error) {
            console.error("Error en obtenerEstudiantes (backend service):", error);
            throw new Error(`Error al obtener estudiantes: ${error.message}`);
        }
    };

    /**
     * Obtiene un estudiante por su ID.
     * @param {string} id - ID del estudiante.
     * @returns {Promise<Object|null>} Datos del estudiante o null si no se encuentra.
     */
    const obtenerEstudiantePorId = async (id) => {
        try {
            const docRef = db.collection("estudiantes").doc(id);
            const docSnap = await docRef.get();

            if (docSnap.exists) {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    fechaCreacion: data.fechaCreacion ? data.fechaCreacion.toDate().toLocaleDateString() : null,
                    fechaActualizacion: data.fechaActualizacion ? data.fechaActualizacion.toDate().toLocaleDateString() : null,
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error en obtenerEstudiantePorId (backend service):", error);
            throw new Error(`Error al obtener estudiante: ${error.message}`);
        }
    };

    /**
     * Actualiza un estudiante existente.
     * @param {string} id - ID del estudiante a actualizar.
     * @param {Object} nuevosDatos - Datos a actualizar del estudiante.
     * @returns {Promise<void>}
     */
    const actualizarEstudiante = async (id, nuevosDatos) => {
        try {
            const docRef = db.collection("estudiantes").doc(id);
            await docRef.update({
                ...nuevosDatos,
                fechaActualizacion: new Date() // Usar objeto Date()
            });
        } catch (error) {
            console.error("Error en actualizarEstudiante (backend service):", error);
            throw new Error(`Error al actualizar estudiante: ${error.message}`);
        }
    };

    /**
     * Elimina un estudiante por su ID.
     * @param {string} id - ID del estudiante a eliminar.
     * @returns {Promise<void>}
     */
    const eliminarEstudiante = async (id) => {
        try {
            const docRef = db.collection("estudiantes").doc(id);
            await docRef.delete();
            // Si el estudiante tiene un usuario de Auth asociado, deberías eliminarlo también
            // const userRecord = await db.collection('estudiantes').doc(id).get();
            // if (userRecord.exists && userRecord.data().uid) {
            //     await auth.deleteUser(userRecord.data().uid);
            //     console.log('Successfully deleted user from Auth:', userRecord.data().uid);
            // }
        } catch (error) {
            console.error("Error en eliminarEstudiante (backend service):", error);
            throw new Error(`Error al eliminar estudiante: ${error.message}`);
        }
    };

    /**
     * Busca un estudiante por documento (ya existía en departamentoService).
     * Nota: Si este método ya existe en estudianteService, se elimina la duplicidad.
     * @param {string} tipoDocumento - Tipo de documento (ej. "CC", "TI").
     * @param {string} numeroDocumento - Número de documento del estudiante.
     * @returns {Promise<Object|null>} Datos del estudiante o null si no se encuentra.
     */
    const buscarEstudiantePorDocumento = async (tipoDocumento, numeroDocumento) => {
        try {
            const q = db.collection('estudiantes')
                        .where("tipoDocumento", "==", tipoDocumento)
                        .where("numeroDocumento", "==", numeroDocumento)
                        .limit(1);

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
        crearEstudiante,
        obtenerEstudiantes,
        obtenerEstudiantePorId,
        actualizarEstudiante,
        eliminarEstudiante,
        buscarEstudiantePorDocumento, // Ya lo tenías en tu departamentoService, lo movemos aquí.
    };
}