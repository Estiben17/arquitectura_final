import asistenciaService from '../Service/asistenciaService.js';

const asistenciaController = {
  async crearAsistencia(req, res) {
    try {
      const nuevaAsistencia = await asistenciaService.crearAsistencia(req.body);
      res.status(201).json(nuevaAsistencia);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerAsistencias(req, res) {
    try {
      const filtros = req.query;
      const asistencias = await asistenciaService.obtenerAsistencias(filtros);
      res.status(200).json(asistencias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async registrarAsistenciaEstudiante(req, res) {
    try {
      const { id } = req.params;
      await asistenciaService.registrarAsistenciaEstudiante(id, req.body);
      res.status(200).json({ message: "Asistencia registrada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerEstudiantesParaAsistencia(req, res) {
    try {
      const { idAsignatura, grupo } = req.query;
      const estudiantes = await asistenciaService.obtenerEstudiantesParaAsistencia(idAsignatura, grupo);
      res.status(200).json(estudiantes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default asistenciaController;