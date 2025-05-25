import express from 'express';
import asistenciaController from '../controller/asistenciaController.js';

const router = express.Router();

// Rutas para la gestión de asistencias
router.post('/asistencias', asistenciaController.crearAsistencia);
router.get('/asistencias', asistenciaController.obtenerAsistencias);
router.put('/asistencias/:id/estudiantes', asistenciaController.registrarAsistenciaEstudiante);
router.get('/asistencias/estudiantes', asistenciaController.obtenerEstudiantesParaAsistencia);

export default router;