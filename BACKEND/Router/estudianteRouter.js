import express from 'express';
import estudianteController from '../Controller/estudianteController.js';

const router = express.Router();

// Rutas para la gestión de estudiantes
router.post('/estudiantes', estudianteController.crearEstudiante);
router.get('/estudiantes', estudianteController.obtenerEstudiantes);
router.put('/estudiantes/:id', estudianteController.actualizarEstudiante);
router.get('/estudiantes/buscar', estudianteController.buscarPorDocumento);

export default router;