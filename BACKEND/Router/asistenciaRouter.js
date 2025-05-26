// BACKEND/Router/asistenciaRouter.js

import { Router } from 'express'; // Importa Router directamente
// =========================================================================
// PASO CLAVE: Importa la FUNCIÓN que crea tu controlador de asistencia
import createAsistenciaController from '../Controller/asistenciaController.js';
// =========================================================================

// =========================================================================
// PASO CLAVE: Exporta una FUNCIÓN que crea este router,
// y que RECIBE 'db' y 'auth' (del Admin SDK) como argumentos.
export default function createAsistenciaRouter(db, auth) {
    const router = Router(); // Crea una nueva instancia de Router aquí

    // =====================================================================
    // PASO CLAVE: Instancia tu controlador de asistencia,
    // pasándole 'db' y 'auth'.
    const asistenciaController = createAsistenciaController(db, auth);
    // =====================================================================

    // Rutas para la gestión de asistencias
    // NOTA: Ajusta las rutas relativas al prefijo que le das en app.js.
    // Si en app.js usas app.use('/api/asistencias', createAsistenciaRouter(db, auth));
    // entonces aquí las rutas como '/asistencias' se convierten en '/'.

    router.post('/', asistenciaController.crearAsistencia); // Cambiado de '/asistencias' a '/'
    router.get('/', asistenciaController.obtenerAsistencias); // Cambiado de '/asistencias' a '/'
    router.put('/:id/estudiantes', asistenciaController.registrarAsistenciaEstudiante); // Ya era relativa
    router.get('/estudiantes', asistenciaController.obtenerEstudiantesParaAsistencia); // Ya era relativa

    return router; // Retorna la instancia de Router
}