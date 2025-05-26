// BACKEND/Router/estudianteRouter.js

import { Router } from 'express';
import createEstudianteController from '../Controller/estudianteController.js';
import createEstudianteService from '../Service/estudianteService.js'; 

export default function createEstudianteRouter(db, auth) {
    console.log('EstudianteRouter: createEstudianteRouter ha sido llamado.');
    const router = Router();
    
    const estudianteService = createEstudianteService(db, auth); 
    const estudianteController = createEstudianteController(estudianteService); 
    console.log('EstudianteRouter: EstudianteController ha sido instanciado.');

    // RUTA PARA OBTENER TIPOS DE DOCUMENTO (más específica)
    router.get('/documentTypes', (req, res, next) => {
        console.log('EstudianteRouter: Ruta /documentTypes alcanzada!');
        estudianteController.getTiposDocumento(req, res, next);
    });

    // RUTA PARA OBTENER FACULTADES (más específica)
    router.get('/facultades', (req, res, next) => {
        console.log('EstudianteRouter: Ruta /facultades alcanzada!');
        estudianteController.getFacultades(req, res, next);
    });

    // RUTA PARA BUSCAR ESTUDIANTE POR DOCUMENTO (MUY IMPORTANTE: ¡AHORA VA ANTES DE /estudiantes/:id!)
    router.get('/estudiantes/buscar-documento', (req, res, next) => {
        console.log('!!!!!!! EstudianteRouter: Ruta /estudiantes/buscar-documento ha sido alcanzada en el router !!!!!!!');
        estudianteController.buscarPorDocumento(req, res, next);
    });

   
    router.get('/estudiantes', (req, res, next) => {
        console.log('EstudianteRouter: Ruta /estudiantes (con o sin paginación) alcanzada!');
        estudianteController.obtenerEstudiantes(req, res, next);
    });

    // Rutas CRUD de estudiantes
    router.post('/estudiantes', (req, res, next) => estudianteController.crearEstudiante(req, res, next));
    
    // RUTA PARA OBTENER ESTUDIANTE POR ID (más general, va después de las específicas)
    router.get('/estudiantes/:id', (req, res, next) => estudianteController.obtenerEstudiantePorId(req, res, next));
    
    router.put('/estudiantes/:id', (req, res, next) => estudianteController.actualizarEstudiante(req, res, next));
    router.delete('/estudiantes/:id', (req, res, next) => estudianteController.eliminarEstudiante(req, res, next));

    console.log('EstudianteRouter: Router de estudiante configurado y listo para retornar.');
    return router;
}