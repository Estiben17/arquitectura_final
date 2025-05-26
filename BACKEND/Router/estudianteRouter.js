// BACKEND/Router/estudianteRouter.js

import { Router } from 'express';
import createEstudianteController from '../Controller/estudianteController.js';
import createEstudianteService from '../Service/estudianteService.js'; // Importa el servicio aquí

export default function createEstudianteRouter(db, auth) {
    console.log('EstudianteRouter: createEstudianteRouter ha sido llamado.');
    const router = Router();
    
    // Primero, crea la instancia del servicio, ya que el controlador la necesita
    const estudianteService = createEstudianteService(db, auth); 
    
    // Luego, crea la instancia del controlador, pasándole el servicio
    const estudianteController = createEstudianteController(estudianteService); 
    console.log('EstudianteRouter: EstudianteController ha sido instanciado.');

    // Rutas para estudiantes (CRUD - Asegúrate de tener estas)
    router.post('/estudiantes', (req, res, next) => estudianteController.crearEstudiante(req, res, next));
    router.get('/estudiantes/:id', (req, res, next) => estudianteController.obtenerEstudiantePorId(req, res, next));
    router.put('/estudiantes/:id', (req, res, next) => estudianteController.actualizarEstudiante(req, res, next));
    router.delete('/estudiantes/:id', (req, res, next) => estudianteController.eliminarEstudiante(req, res, next));

    // Ruta para buscar estudiante por documento (ya la tienes)
    router.get('/estudiantes/buscar-documento', (req, res, next) => {
        console.log('EstudianteRouter: Ruta /estudiantes/buscar-documento alcanzada!');
        estudianteController.buscarPorDocumento(req, res, next);
    });

    // RUTA GENERAL PARA OBTENER ESTUDIANTES (PARA PAGINACIÓN Y FILTROS)
    // Esta ruta es la que tu frontend llama con: /api/estudiantes?_page=1&_limit=5
    router.get('/estudiantes', (req, res, next) => {
        console.log('EstudianteRouter: Ruta /estudiantes (con o sin paginación) alcanzada!');
        estudianteController.obtenerEstudiantes(req, res, next);
    });

    // NUEVAS RUTAS QUE FALTAN Y CAUSAN EL 404:
    // Ruta para obtener tipos de documento
    router.get('/documentTypes', (req, res, next) => {
        console.log('EstudianteRouter: Ruta /documentTypes alcanzada!');
        estudianteController.getTiposDocumento(req, res, next);
    });

    // Ruta para obtener facultades
    router.get('/facultades', (req, res, next) => {
        console.log('EstudianteRouter: Ruta /facultades alcanzada!');
        estudianteController.getFacultades(req, res, next);
    });

    console.log('EstudianteRouter: Router de estudiante configurado y listo para retornar.');
    return router;
}