// BACKEND/Router/departamentoRouter.js

import { Router } from 'express'; // Importa Router directamente
// =========================================================================
// PASO CLAVE: Importa la FUNCIÓN que crea tu controlador de departamento
import createDepartamentoController from '../Controller/departamentoController.js';
// =========================================================================

// =========================================================================
// PASO CLAVE: Exporta una FUNCIÓN que crea este router,
// y que RECIBE 'db' y 'auth' (del Admin SDK) como argumentos.
export default function createDepartamentoRouter(db, auth) {
    const router = Router(); // Crea una nueva instancia de Router aquí

    // =====================================================================
    // PASO CLAVE: Instancia tu controlador de departamento,
    // pasándole 'db' y 'auth'.
    const departamentoController = createDepartamentoController(db, auth);
    // =====================================================================

    // Rutas para la gestión de departamentos
    // NOTA: Ajusta las rutas relativas al prefijo que le das en app.js.
    // Si en app.js usas app.use('/api/departamentos', createDepartamentoRouter(db, auth));
    // entonces aquí las rutas como '/departamentos' se convierten en '/'.

    router.get('/', departamentoController.obtenerDepartamentos); // Cambiado de '/departamentos' a '/'
    router.get('/:id', departamentoController.obtenerDepartamento); // Mantiene '/:id'
    router.put('/:id', departamentoController.actualizarDepartamento); // Mantiene '/:id'
    router.get('/:id/estadisticas', departamentoController.obtenerEstadisticas); // Mantiene '/:id/estadisticas'

    // Ruta para búsqueda de estudiantes (Esta ruta se mantiene como está, ya que es específica y no repite el prefijo 'departamentos')
    router.get('/estudiantes/buscar', departamentoController.buscarEstudiante);

    return router; // Retorna la instancia de Router
}