import departamentoService from '../Service/departamentoService.js';

const departamentoController = {
  async obtenerDepartamentos(req, res) {
    try {
      const filtros = req.query;
      const departamentos = await departamentoService.obtenerDepartamentos(filtros);
      res.status(200).json(departamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerDepartamento(req, res) {
    try {
      const { id } = req.params;
      const departamento = await departamentoService.obtenerDepartamentoPorId(id);
      res.status(200).json(departamento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarDepartamento(req, res) {
    try {
      const { id } = req.params;
      await departamentoService.actualizarDepartamento(id, req.body);
      res.status(200).json({ message: "Departamento actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerEstadisticas(req, res) {
    try {
      const { id } = req.params;
      const estadisticas = await departamentoService.obtenerEstadisticasDepartamento(id);
      res.status(200).json(estadisticas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarEstudiante(req, res) {
    try {
      const { documento } = req.query;
      const estudiante = await departamentoService.buscarEstudiantePorDocumento(documento);
      
      if (!estudiante) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }
      
      res.status(200).json(estudiante);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default departamentoController;