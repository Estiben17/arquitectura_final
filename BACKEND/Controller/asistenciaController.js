// BACKEND/Controller/asistenciaController.js

import createAsistenciaService from '../Service/asistenciaService.js';

export default function createAsistenciaController(db, auth) {

   
    const asistenciaService = createAsistenciaService(db, auth);
    
    const crearAsistencia = async (req, res) => {
        try {
            const nuevaAsistencia = await asistenciaService.crearAsistencia(req.body);
            res.status(201).json(nuevaAsistencia);
        } catch (error) {
            console.error('Error en controlador (crearAsistencia):', error);
            res.status(500).json({ error: error.message });
        }
    };

    const obtenerAsistencias = async (req, res) => {
        try {
            const filtros = req.query;
            const asistencias = await asistenciaService.obtenerAsistencias(filtros);
            res.status(200).json(asistencias);
        } catch (error) {
            console.error('Error en controlador (obtenerAsistencias):', error);
            res.status(500).json({ error: error.message });
        }
    };

    const registrarAsistenciaEstudiante = async (req, res) => {
        try {
            const { id } = req.params;
            await asistenciaService.registrarAsistenciaEstudiante(id, req.body);
            res.status(200).json({ message: "Asistencia registrada correctamente" });
        } catch (error) {
            console.error('Error en controlador (registrarAsistenciaEstudiante):', error);
            res.status(500).json({ error: error.message });
        }
    };

    const obtenerEstudiantesParaAsistencia = async (req, res) => {
        try {
            const { idAsignatura, grupo } = req.query;
            const estudiantes = await asistenciaService.obtenerEstudiantesParaAsistencia(idAsignatura, grupo);
            res.status(200).json(estudiantes);
        } catch (error) {
            console.error('Error en controlador (obtenerEstudiantesParaAsistencia):', error);
            res.status(500).json({ error: error.message });
        }
    };


    return {
        crearAsistencia,
        obtenerAsistencias,
        registrarAsistenciaEstudiante,
        obtenerEstudiantesParaAsistencia
    };
    
}