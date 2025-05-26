// BACKEND/Router/asignaturaRouter.js

import { Router } from 'express'; // Importa Router directamente

import createAsignaturaController from '../Controller/asignaturaController.js';

export default function createAsignaturaRouter(db, auth) {
    const router = Router(); // Crea una nueva instancia de Router aquí

    const asignaturaController = createAsignaturaController(db, auth);
    

    router.post('/', asignaturaController.crearAsignaturaController);
    router.get('/', asignaturaController.obtenerAsignaturasController);
    

    return router; // Retorna la instancia de Router
}