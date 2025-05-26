// BACKEND/Router/asistenciaRouter.js

import { Router } from 'express'; // Importa Router directamente
import createAsistenciaController from '../Controller/asistenciaController.js';

export default function createAsistenciaRouter(db, auth) {
    const router = Router(); // Crea una nueva instancia de Router aquí

    
    const asistenciaController = createAsistenciaController(db, auth);
    
    router.post('/', asistenciaController.crearAsistencia); // Cambiado de '/asistencias' a '/'
    router.get('/', asistenciaController.obtenerAsistencias); // Cambiado de '/asistencias' a '/'
    router.put('/:id/estudiantes', asistenciaController.registrarAsistenciaEstudiante); // Ya era relativa
    router.get('/estudiantes', asistenciaController.obtenerEstudiantesParaAsistencia); // Ya era relativa

    return router; // Retorna la instancia de Router
}