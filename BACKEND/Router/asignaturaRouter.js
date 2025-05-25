import express from 'express';
import { crearAsignaturaController, obtenerAsignaturasController } from '../controller/asignaturaController.js';

const router = express.Router();

router.post('/asignaturas', crearAsignaturaController);
router.get('/asignaturas', obtenerAsignaturasController);

export default router;
