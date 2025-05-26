// BACKEND/Router/departamentoRouter.js
import { Router } from 'express'; 
import createDepartamentoController from '../Controller/departamentoController.js';

export default function createDepartamentoRouter(db, auth) {
    const router = Router(); // Crea una nueva instancia de Router aquí

    
    const departamentoController = createDepartamentoController(db, auth);
    
    router.get('/', departamentoController.obtenerDepartamentos); // Cambiado de '/departamentos' a '/'
    router.get('/:id', departamentoController.obtenerDepartamento); // Mantiene '/:id'
    router.put('/:id', departamentoController.actualizarDepartamento); // Mantiene '/:id'
    router.get('/:id/estadisticas', departamentoController.obtenerEstadisticas); // Mantiene '/:id/estadisticas'

    // Ruta para búsqueda de estudiantes (Esta ruta se mantiene como está, ya que es específica y no repite el prefijo 'departamentos')
    router.get('/estudiantes/buscar', departamentoController.buscarEstudiante);

    return router; // Retorna la instancia de Router
}