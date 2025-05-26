// BACKEND/Service/estudianteService.js

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
            if (!datosEstudiante.firstName || !datosEstudiante.firstSurname || !datosEstudiante.documentNumber) {
                throw new Error("Nombre, apellido y número de documento son campos obligatorios para el estudiante.");
            }

            const estudianteData = {
                ...datosEstudiante,
                fechaCreacion: new Date(), // Usar objeto Date() o admin.firestore.FieldValue.serverTimestamp()
                fechaActualizacion: new Date(),
                estado: datosEstudiante.estado || "activo", // Por defecto 'activo'
                asignaturas: datosEstudiante.asignaturas || [], // Array para IDs de asignaturas
                // IMPORTANTE: Cuando crees estudiantes, asegúrate de que los datos de documento
                // que envías aquí coincidan con 'tipo de documento' y 'numero de documento'
                // si quieres usar la misma convención que ya tienes en Firestore.
                // Si el frontend envía 'documentType' y 'documentNumber', debes mapearlos aquí.
                // Por ejemplo:
                // 'tipo de documento': datosEstudiante.documentType,
                // 'numero de documento': datosEstudiante.documentNumber
            };

            const docRef = await db.collection('estudiantes').add(estudianteData);

            return {
                id: docRef.id,
                ...estudianteData
            };
        } catch (error) {
            console.error("Error en crearEstudiante (backend service):", error);
            if (error.code === 'auth/email-already-exists') { // Si manejas creación de usuarios con email
                throw new Error("El correo electrónico ya está registrado.");
            }
            throw new Error(`Error al crear estudiante: ${error.message}`);
        }
    };

    /**
     * Obtiene todos los estudiantes con filtros opcionales y paginación.
     * @param {Object} filtros - Objeto con filtros de búsqueda (ej. idDepartamento, grupo, estado, busqueda por nombre/documento).
     * @param {number} page - Número de página actual.
     * @param {number} pageSize - Tamaño de la página.
     * @returns {Promise<Object>} Objeto con lista de estudiantes y totalCount.
     */
    const obtenerEstudiantes = async (filtros = {}, page = 1, pageSize = 5) => {
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
                // CORREGIDO: Asegura que el nombre del campo coincida con Firestore
                q = q.where("tipo de documento", "==", filtros.tipoDocumento);
            }
            if (filtros.busqueda) {
                const searchTerm = filtros.busqueda.toLowerCase();
                q = q.where("firstName", ">=", searchTerm)
                     .where("firstName", "<=", searchTerm + '\uf8ff');
            }

            const totalSnapshot = await q.get();
            const totalCount = totalSnapshot.size;

            const offset = (page - 1) * pageSize;
            q = q.orderBy('fechaCreacion', 'desc')
                 .limit(pageSize)
                 .offset(offset);

            const querySnapshot = await q.get();
            const students = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    fechaCreacion: data.fechaCreacion ? data.fechaCreacion.toDate().toISOString() : null,
                    fechaActualizacion: data.fechaActualizacion ? data.fechaActualizacion.toDate().toISOString() : null,
                };
            });
            return { students, totalCount };

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
                    fechaCreacion: data.fechaCreacion ? data.fechaCreacion.toDate().toISOString() : null,
                    fechaActualizacion: data.fechaActualizacion ? data.fechaActualizacion.toDate().toISOString() : null,
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
            // IMPORTANTE: Si actualizas el tipo o número de documento, asegúrate de
            // que los nombres de los campos en 'nuevosDatos' sean 'tipo de documento' y 'numero de documento'.
            await docRef.update({
                ...nuevosDatos,
                fechaActualizacion: new Date()
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
        } catch (error) {
            console.error("Error en eliminarEstudiante (backend service):", error);
            throw new Error(`Error al eliminar estudiante: ${error.message}`);
        }
    };

    /**
     * Busca un estudiante por documento.
     * @param {string} tipoDocumento - Tipo de documento (ej. "CC", "TI").
     * @param {string} numeroDocumento - Número de documento del estudiante.
     * @returns {Promise<Object|null>} Datos del estudiante o null si no se encuentra.
     */
    const buscarEstudiantePorDocumento = async (tipoDocumento, numeroDocumento) => {
        console.log(`EstudianteService: Buscando estudiante por tipo: ${tipoDocumento}, numero: ${numeroDocumento}`);
        try {
            const q = db.collection('estudiantes')
                        // CORREGIDO: Los nombres de los campos deben coincidir con tu Firestore
                        .where("tipo de documento", "==", tipoDocumento) //
                        .where("numero de documento", "==", numeroDocumento) //
                        .limit(1);

            const querySnapshot = await q.get();

            console.log(`EstudianteService: Documentos encontrados: ${querySnapshot.docs.length}`); // Agregado para depuración

            if (querySnapshot.empty) {
                console.log('EstudianteService: No se encontró ningún estudiante con ese documento.'); // Agregado para depuración
                return null;
            }

            const doc = querySnapshot.docs[0];
            const data = doc.data();
            console.log('EstudianteService: Estudiante encontrado:', { id: doc.id, ...data }); // Agregado para depuración

            return {
                id: doc.id,
                ...data
            };
        } catch (error) {
            console.error("Error en buscarEstudiantePorDocumento (backend service):", error);
            throw new Error(`Error al buscar estudiante por documento: ${error.message}`);
        }
    };

    /**
     * Obtiene todos los tipos de documento disponibles.
     * NOTA: Este es un ejemplo. Podrías tener una colección en Firestore para esto,
     * o definirlo en tu backend.
     */
    const obtenerTiposDocumento = async () => {
        return [
            { code: 'CC', name: 'Cédula de Ciudadanía' },
            { code: 'TI', name: 'Tarjeta de Identidad' },
            { code: 'CE', name: 'Cédula de Extranjería' },
            { code: 'PA', name: 'Pasaporte' }
        ];
    };

    /**
     * Obtiene todas las facultades disponibles.
     * NOTA: Este es un ejemplo. Podrías tener una colección en Firestore para esto,
     * o definirlo en tu backend.
     */
    const obtenerFacultades = async () => {
        return [
            { code: 'ING', name: 'Ingeniería' },
            { code: 'SAL', name: 'Ciencias de la Salud' },
            { code: 'ART', name: 'Artes y Humanidades' },
            { code: 'EDU', name: 'Educación' }
        ];
    };

    // Retorna el objeto con los métodos del servicio
    return {
        crearEstudiante,
        obtenerEstudiantes,
        obtenerEstudiantePorId,
        actualizarEstudiante,
        eliminarEstudiante,
        buscarEstudiantePorDocumento,
        obtenerTiposDocumento,
        obtenerFacultades
    };
}