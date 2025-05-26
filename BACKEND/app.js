// BACKEND/app.js (Modificado)

import express from 'express';
import cors from 'cors';

// =========================================================================
// PASO CLAVE: Importa db y auth desde tu archivo firebase.js (Admin SDK)
import { db, auth } from './firebase.js';
// =========================================================================

// =========================================================================
// PASO CLAVE: Importa las FUNCIONES que crean tus routers
// Tus archivos de router (ej. asignaturaRouter.js) deben EXPORTAR UNA FUNCIÓN
// que reciba db y auth, no un objeto Router directamente.
import createAsignaturaRouter from './Router/asignaturaRouter.js';
import createAsistenciaRouter from './Router/asistenciaRouter.js';
import createDepartamentoRouter from './Router/departamentoRouter.js';
import createEstudianteRouter from './Router/estudianteRouter.js';
// =========================================================================

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// =========================================================================
// PASO CLAVE: Inicializa los Routers, pasándoles las instancias de db y auth
app.use('/api/asignaturas', createAsignaturaRouter(db, auth)); // Llama a la función
app.use('/api/asistencias', createAsistenciaRouter(db, auth)); // Llama a la función
app.use('/api/departamentos', createDepartamentoRouter(db, auth)); // Llama a la función
app.use('/api', createEstudianteRouter(db, auth)); // Llama a la función
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