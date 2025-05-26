// BACKEND/Router/estudianteRouter.js

import { Router } from 'express'; // Importa Router directamente
// =========================================================================
// PASO CLAVE: Importa la FUNCIÓN que crea tu controlador de estudiante
import createEstudianteController from '../Controller/estudianteController.js';
// =========================================================================

// =========================================================================
// PASO CLAVE: Exporta una FUNCIÓN que crea este router,
// y que RECIBE 'db' y 'auth' (del Admin SDK) como argumentos.
export default function createEstudianteRouter(db, auth) {
    const router = Router(); // Crea una nueva instancia de Router aquí

    // =====================================================================
    // PASO CLAVE: Instancia tu controlador de estudiante,
    // pasándole 'db' y 'auth'.
    const estudianteController = createEstudianteController(db, auth);
    // =====================================================================

    // Rutas para la gestión de estudiantes
    // NOTA: Estas rutas ya son las que se esperan después de '/api' en app.js.
    // Por ejemplo, router.post('/estudiantes') será accesible como POST /api/estudiantes

    router.post('/estudiantes', estudianteController.crearEstudiante);
    router.get('/estudiantes', estudianteController.obtenerEstudiantes);
    router.put('/estudiantes/:id', estudianteController.actualizarEstudiante);
    router.get('/estudiantes/buscar', estudianteController.buscarPorDocumento);
    // Añade la ruta para obtener por ID si la implementaste en el controlador
    // router.get('/estudiantes/:id', estudianteController.obtenerEstudiantePorId);


    return router; // Retorna la instancia de Router
}