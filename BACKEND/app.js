import express from 'express';
import cors from 'cors';
import asignaturaRouter from './Router/asignaturaRouter.js';
import asistenciaRouter from './Router/asistenciaRouter.js';
import departamentoRouter from './Router/departamentoRouter.js';
import estudianteRouter from './Router/estudianteRouter.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
app.use('/api/asignaturas', asignaturaRouter);
app.use('/api/asistencias', asistenciaRouter);
app.use('/api/departamentos', departamentoRouter);
app.use('/api', estudianteRouter);

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

