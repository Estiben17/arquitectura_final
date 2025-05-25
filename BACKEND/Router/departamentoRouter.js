import express from 'express';
import departamentoController from '../controller/departamentoController.js';

const router = express.Router();

// Rutas para la gestión de departamentos
router.get('/departamentos', departamentoController.obtenerDepartamentos);
router.get('/departamentos/:id', departamentoController.obtenerDepartamento);
router.put('/departamentos/:id', departamentoController.actualizarDepartamento);
router.get('/departamentos/:id/estadisticas', departamentoController.obtenerEstadisticas);

// Ruta para búsqueda de estudiantes
router.get('/estudiantes/buscar', departamentoController.buscarEstudiante);

export default router;