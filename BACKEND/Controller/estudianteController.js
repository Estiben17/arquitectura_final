// BACKEND/Controller/estudianteController.js

import createEstudianteService from '../Service/estudianteService.js';

export default function createEstudianteController(estudianteService) { // <<-- CAMBIO AQUI: Recibe directamente el servicio
    // El servicio ya se pasa desde el router, no lo crees aquí de nuevo
    // const estudianteService = createEstudianteService(db, auth); // ELIMINAR ESTA LINEA

    // =====================================================================
    // DEFINICIÓN DE LAS FUNCIONES DEL CONTROLADOR
    // =====================================================================

    const crearEstudiante = async (req, res) => {
        try {
            if (!req.body.firstName || !req.body.firstSurname || !req.body.documentType || !req.body.documentNumber) {
                return res.status(400).json({ error: "Datos incompletos: nombre, apellido, tipo y número de documento son obligatorios." });
            }

            const estudianteData = {
                ...req.body,
                searchKeywords: [
                    (req.body.firstName || '').toLowerCase(),
                    (req.body.secondName || '').toLowerCase(),
                    (req.body.firstSurname || '').toLowerCase(),
                    (req.body.secondSurname || '').toLowerCase(),
                    (req.body.documentNumber || '').toLowerCase()
                ],
                fechaCreacion: new Date(),
                fechaActualizacion: new Date()
            };

            const nuevoEstudiante = await estudianteService.crearEstudiante(estudianteData);
            res.status(201).json(nuevoEstudiante);
        } catch (error) {
            console.error('Error en crearEstudiante (Controller):', error);
            res.status(500).json({ error: "Error al crear estudiante", details: error.message });
        }
    };

    const obtenerEstudiantes = async (req, res) => {
        try {
            const { page = 1, limit = 10, ...filtros } = req.query;
            const pagina = parseInt(page);
            const limite = parseInt(limit);

            if (isNaN(pagina) || isNaN(limite) || pagina < 1 || limite < 1) {
                return res.status(400).json({ error: "Parámetros de paginación inválidos" });
            }

            const { students, totalCount } = await estudianteService.obtenerEstudiantes(filtros, pagina, limite);

            res.set('X-Total-Count', totalCount); 
            
            res.status(200).json(students);
        } catch (error) {
            console.error('Error en obtenerEstudiantes (Controller):', error);
            res.status(500).json({ error: "Error al obtener estudiantes", details: error.message });
        }
    };

    const actualizarEstudiante = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "ID de estudiante es requerido para actualizar" });
            }

            const updateData = {
                ...req.body,
                fechaActualizacion: new Date()
            };

            if (req.body.firstName || req.body.secondName || req.body.firstSurname || req.body.secondSurname || req.body.documentNumber) {
                updateData.searchKeywords = [
                    (req.body.firstName || '').toLowerCase(),
                    (req.body.secondName || '').toLowerCase(),
                    (req.body.firstSurname || '').toLowerCase(),
                    (req.body.secondSurname || '').toLowerCase(),
                    (req.body.documentNumber || '').toLowerCase()
                ];
            }

            await estudianteService.actualizarEstudiante(id, updateData);
            res.status(200).json({ message: "Estudiante actualizado correctamente" });
        } catch (error) {
            console.error('Error en actualizarEstudiante (Controller):', error);
            res.status(500).json({ error: "Error al actualizar estudiante", details: error.message });
        }
    };

    const buscarPorDocumento = async (req, res) => {
        console.log('EstudianteController: Método buscarPorDocumento ejecutado.'); 
        try {
            const { tipo, numero } = req.query;

            if (!tipo || !numero) {
                return res.status(400).json({
                    error: "Parámetros requeridos",
                    details: "Tipo y número de documento son obligatorios"
                });
            }

            const estudiante = await estudianteService.buscarEstudiantePorDocumento(
                tipo,
                numero
            );

            if (!estudiante) {
                return res.status(404).json({
                    message: "Estudiante no encontrado",
                    tipoDocumento: tipo,
                    numeroDocumento: numero
                });
            }

            res.status(200).json(estudiante);
        } catch (error) {
            console.error('Error en buscarPorDocumento (Controller):', error);
            res.status(500).json({
                error: "Error en búsqueda de estudiante",
                details: error.message
            });
        }
    };

    const obtenerEstudiantePorId = async (req, res) => {
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
            console.error('Error en obtenerEstudiantePorId (Controller):', error);
            res.status(500).json({ error: "Error al obtener estudiante", details: error.message });
        }
    };

    const eliminarEstudiante = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "ID de estudiante es requerido para eliminar" });
            }
            await estudianteService.eliminarEstudiante(id);
            res.status(200).json({ message: "Estudiante eliminado correctamente" });
        } catch (error) {
            console.error('Error en eliminarEstudiante (Controller):', error);
            res.status(500).json({ error: "Error al eliminar estudiante", details: error.message });
        }
    };

    // =====================================================================
    // ¡NUEVOS MÉTODOS NECESARIOS!
    // Estos son los que tu frontend está esperando.
    // =====================================================================

    const getTiposDocumento = async (req, res) => {
        try {
            const tipos = await estudianteService.obtenerTiposDocumento();
            res.status(200).json(tipos);
        } catch (error) {
            console.error("Error en getTiposDocumento (controller):", error);
            res.status(500).json({ message: "Error al obtener tipos de documento", details: error.message });
        }
    };

    const getFacultades = async (req, res) => {
        try {
            const facultades = await estudianteService.obtenerFacultades();
            res.status(200).json(facultades);
        } catch (error) {
            console.error("Error en getFacultades (controller):", error);
            res.status(500).json({ message: "Error al obtener facultades", details: error.message });
        }
    };

    // =====================================================================
    // RETORNO DEL OBJETO CONTROLADOR
    // Asegúrate de que todos los métodos que quieres exponer estén aquí.
    // =====================================================================
    return {
        crearEstudiante,
        obtenerEstudiantes,
        actualizarEstudiante,
        buscarPorDocumento,
        obtenerEstudiantePorId,
        eliminarEstudiante,
        getTiposDocumento, // <<-- AÑADIDO
        getFacultades     // <<-- AÑADIDO
    };
}