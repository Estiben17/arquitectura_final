// BACKEND/app.js (Modificado para depuración)

import express from 'express';
import cors from 'cors';

import { db, auth } from './firebase.js';

import createAsignaturaRouter from './Router/asignaturaRouter.js';
import createAsistenciaRouter from './Router/asistenciaRouter.js';
import createDepartamentoRouter from './Router/departamentoRouter.js';
import createEstudianteRouter from './Router/estudianteRouter.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[DEBUG] Solicitud entrante: ${req.method} ${req.originalUrl}`);
    next();
});

console.log('App.js: Montando router de asignaturas...');
app.use('/api/asignaturas', createAsignaturaRouter(db, auth));
console.log('App.js: Montando router de asistencias...');
app.use('/api/asistencias', createAsistenciaRouter(db, auth));
console.log('App.js: Montando router de departamentos...');
app.use('/api/departamentos', createDepartamentoRouter(db, auth));
console.log('App.js: Montando router de estudiantes en /api...');
app.use('/api', createEstudianteRouter(db, auth)); // ESTA LÍNEA ES CLAVE
console.log('App.js: Routers de API montados.');
// =========================================================================

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Sistema de Gestión Académica - Backend funcionando correctamente');
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});