import estudianteService from '../Service/estudianteService.js';

const estudianteController = {
  async crearEstudiante(req, res) {
    try {
      // Validación básica
      if (!req.body.nombres || !req.body.apellidos || !req.body.tipoDocumento || !req.body.numeroDocumento) {
        return res.status(400).json({ error: "Datos incompletos" });
      }

      // Preparamos datos para Firebase
      const estudianteData = {
        ...req.body,
        // Creamos campos para búsqueda eficiente
        searchKeywords: [
          req.body.nombres.toLowerCase(),
          req.body.apellidos.toLowerCase(),
          req.body.numeroDocumento.toLowerCase()
        ],
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      };

      const nuevoEstudiante = await estudianteService.crearEstudiante(estudianteData);
      res.status(201).json({
        id: nuevoEstudiante.id,
        ...nuevoEstudiante.data()
      });
    } catch (error) {
      console.error('Error en crearEstudiante:', error);
      res.status(500).json({ error: "Error al crear estudiante", details: error.message });
    }
  },

  async obtenerEstudiantes(req, res) {
    try {
      const { page = 1, limit = 10, ...filtros } = req.query;
      
      // Convertimos parámetros de paginación a números
      const pagina = parseInt(page);
      const limite = parseInt(limit);
      
      // Validamos parámetros
      if (isNaN(pagina) || isNaN(limite)) {
        return res.status(400).json({ error: "Parámetros de paginación inválidos" });
      }

      const { estudiantes, total } = await estudianteService.obtenerEstudiantes({
        pagina,
        limite,
        filtros
      });

      res.status(200).json({
        data: estudiantes,
        paginacion: {
          paginaActual: pagina,
          totalPaginas: Math.ceil(total / limite),
          totalEstudiantes: total
        }
      });
    } catch (error) {
      console.error('Error en obtenerEstudiantes:', error);
      res.status(500).json({ error: "Error al obtener estudiantes", details: error.message });
    }
  },

  async actualizarEstudiante(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "ID de estudiante es requerido" });
      }

      // Preparamos datos de actualización
      const updateData = {
        ...req.body,
        fechaActualizacion: new Date().toISOString()
      };

      // Si se actualizan campos de búsqueda
      if (req.body.nombres || req.body.apellidos || req.body.numeroDocumento) {
        updateData.searchKeywords = [
          (req.body.nombres || '').toLowerCase(),
          (req.body.apellidos || '').toLowerCase(),
          (req.body.numeroDocumento || '').toLowerCase()
        ];
      }

      await estudianteService.actualizarEstudiante(id, updateData);
      
      res.status(200).json({ 
        message: "Estudiante actualizado correctamente",
        id,
        ...updateData
      });
    } catch (error) {
      console.error('Error en actualizarEstudiante:', error);
      res.status(500).json({ error: "Error al actualizar estudiante", details: error.message });
    }
  },

  async buscarPorDocumento(req, res) {
    try {
      const { tipoDocumento, numeroDocumento } = req.query;
      
      if (!tipoDocumento || !numeroDocumento) {
        return res.status(400).json({ 
          error: "Parámetros requeridos", 
          details: "Tipo y número de documento son obligatorios" 
        });
      }
      
      const estudiante = await estudianteService.buscarPorDocumento(
        tipoDocumento, 
        numeroDocumento
      );
      
      if (!estudiante) {
        return res.status(404).json({ 
          message: "Estudiante no encontrado",
          tipoDocumento,
          numeroDocumento
        });
      }
      
      res.status(200).json(estudiante);
    } catch (error) {
      console.error('Error en buscarPorDocumento:', error);
      res.status(500).json({ 
        error: "Error en búsqueda de estudiante", 
        details: error.message 
      });
    }
  },

  // Nuevo método para obtener un estudiante por ID
  async obtenerEstudiantePorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "ID de estudiante es requerido" });
      }

      const estudiante = await estudianteService.obtenerEstudiantePorId(id);
      
      if (!estudiante) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }
      
      res.status(200).json(estudiante);
    } catch (error) {
      console.error('Error en obtenerEstudiantePorId:', error);
      res.status(500).json({ error: "Error al obtener estudiante", details: error.message });
    }
  }
};

export default estudianteController;