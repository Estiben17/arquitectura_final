// BACKEND/Router/asignaturaRouter.js

import { Router } from 'express'; // Importa Router directamente
// =========================================================================
// PASO CLAVE: Importa la FUNCIÓN que crea tu controlador de asignaturas
import createAsignaturaController from '../Controller/asignaturaController.js';
// =========================================================================

// =========================================================================
// PASO CLAVE: Exporta una FUNCIÓN que crea este router,
// y que RECIBE 'db' y 'auth' (del Admin SDK) como argumentos.
export default function createAsignaturaRouter(db, auth) {
    const router = Router(); // Crea una nueva instancia de Router aquí

    // =====================================================================
    // PASO CLAVE: Instancia tu controlador de asignaturas,
    // pasándole 'db' y 'auth'.
    const asignaturaController = createAsignaturaController(db, auth);
    // =====================================================================

    // Rutas para la gestión de asignaturas
    // Nota: Las rutas aquí deberían ser relativas al prefijo que le das en app.js
    // Si en app.js usas app.use('/api/asignaturas', createAsignaturaRouter(db, auth));
    // entonces aquí la ruta debe ser solo '/'.

    router.post('/', asignaturaController.crearAsignaturaController);
    router.get('/', asignaturaController.obtenerAsignaturasController);
    // Añade aquí las rutas para actualizar y eliminar si las implementaste en el controlador
    // router.put('/:id', asignaturaController.actualizarAsignaturaController);
    // router.delete('/:id', asignaturaController.eliminarAsignaturaController);

    return router; // Retorna la instancia de Router
}