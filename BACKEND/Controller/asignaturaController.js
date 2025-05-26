// BACKEND/Controller/asignaturaController.js

// =========================================================================
// PASO CLAVE: Importa la FUNCIÓN que crea tu servicio
import createAsignaturaService from '../Service/asignaturaService.js';
// =========================================================================

// =========================================================================
// PASO CLAVE: Exporta una FUNCIÓN que crea tu controlador,
// y que RECIBE 'db' y 'auth' (del Admin SDK) como argumentos.
export default function createAsignaturaController(db, auth) {

    // =====================================================================
    // PASO CLAVE: Instancia tu servicio, pasándole 'db' y 'auth'.
    // Ahora, 'asignaturaService' es el objeto que contiene los métodos
    // 'crearAsignatura' y 'obtenerAsignaturas', y estos métodos
    // ya tienen acceso a la instancia 'db' de Firebase Admin.
    const asignaturaService = createAsignaturaService(db, auth);
    // =====================================================================

    // Funciones controladoras
    // NOTA: Ya no desestructuras `crearAsignatura` y `obtenerAsignaturas` de un objeto importado directamente,
    // sino que accedes a ellos a través del objeto `asignaturaService` que acabas de crear.

    const crearAsignaturaController = async (req, res) => {
        try {
            const datos = req.body;
            const nuevaAsignatura = await asignaturaService.crearAsignatura(datos); // Accede a través del objeto
            res.status(201).json(nuevaAsignatura);
        } catch (error) {
            console.error('Error en controlador al crear asignatura:', error);
            // Puedes ajustar el status del error aquí, ej. 400 si es un error de validación
            res.status(400).json({ mensaje: error.message });
        }
    };

    const obtenerAsignaturasController = async (req, res) => {
        try {
            const listaAsignaturas = await asignaturaService.obtenerAsignaturas(); // Accede a través del objeto
            res.status(200).json(listaAsignaturas);
        } catch (error) {
            console.error('Error en controlador al obtener asignaturas:', error);
            res.status(500).json({ mensaje: error.message });
        }
    };

    // Puedes añadir más métodos como actualizarAsignaturaController y eliminarAsignaturaController aquí
    // y llamarlos a través de asignaturaService.actualizarAsignatura(id, datos) y asignaturaService.eliminarAsignatura(id).

    // =====================================================================
    // PASO CLAVE: Retorna un objeto con todas las funciones controladoras
    // que se usarán en el router.
    return {
        crearAsignaturaController,
        obtenerAsignaturasController,
        // (agregar aquí actualizarAsignaturaController, eliminarAsignaturaController si los implementas)
    };
    // =====================================================================
}