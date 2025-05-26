export default function createAsignaturaService(db, auth) { // 'db' es la instancia de Firestore del Admin SDK

    // funciones de servicio. Ahora 'db' es la que fue INYECTADA
    const crearAsignatura = async (datosAsignatura) => {
        try {
            if (!datosAsignatura.codigo || !datosAsignatura.nombre) {
                throw new Error("Código y nombre son campos obligatorios");
            }
            // Usa la instancia 'db' (del Admin SDK) que recibiste
            const docRef = await db.collection('asignaturas').add({
                ...datosAsignatura,
                fechaCreacion: new Date() // O si quieres usar el timestamp del servidor: admin.firestore.FieldValue.serverTimestamp()
            });

            return {
                id: docRef.id,
                ...datosAsignatura
            };
        } catch (error) {
            console.error("Error en crearAsignatura (backend service):", error);
            throw new Error(`Error al crear asignatura: ${error.message}`);
        }
    };

    const obtenerAsignaturas = async () => {
        try {
            // Usa la instancia 'db' (del Admin SDK) que recibiste
            const querySnapshot = await db.collection('asignaturas').get();
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error en obtenerAsignaturas (backend service):", error);
            throw new Error(`Error al obtener asignaturas: ${error.message}`);
        }
    };

    const actualizarAsignatura = async (id, nuevosDatos) => {
        try {
            // Usa la instancia 'db' (del Admin SDK) que recibiste.
            // Para Admin SDK, se usa .doc(id) en lugar de doc(db, collectionName, id)
            const docRef = db.collection('asignaturas').doc(id);
            await docRef.update({
                ...nuevosDatos,
                fechaActualizacion: new Date()
            });
        } catch (error) {
            console.error("Error en actualizarAsignatura (backend service):", error);
            throw new Error(`Error al actualizar asignatura: ${error.message}`);
        }
    };

    const eliminarAsignatura = async (id) => {
        try {
            // Usa la instancia 'db' (del Admin SDK) que recibiste
            const docRef = db.collection('asignaturas').doc(id);
            await docRef.delete();
        } catch (error) {
            console.error("Error en eliminarAsignatura (backend service):", error);
            throw new Error(`Error al eliminar asignatura: ${error.message}`);
        }
    };

    // Retorna el objeto con los métodos del servicio
    return {
        crearAsignatura,
        obtenerAsignaturas,
        actualizarAsignatura,
        eliminarAsignatura
    };
}