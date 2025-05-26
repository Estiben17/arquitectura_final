// BACKEND/Controller/estudianteController.js

import createEstudianteService from '../Service/estudianteService.js';

export default function createEstudianteController(estudianteService) {
    const crearEstudiante = async (req, res) => {
        try {
            // Validar con los nombres de propiedades que envía el frontend (Firestore-compatible)
            if (!req.body.nombre || !req.body.apellido || !req.body['tipo de documento'] || !req.body['numero de documento'] || !req.body.facultad) {
                // Añadí 'facultad' a la validación aquí para que sea más estricta
                return res.status(400).json({ error: "Datos incompletos: nombre, apellido, tipo de documento, número de documento y facultad son obligatorios." });
            }

            const estudianteData = {
                ...req.body, // Esto capturará todos los campos que envía el frontend con los nombres de Firestore
                // Ajustar searchKeywords para usar los nombres de campos de Firestore
                searchKeywords: [
                    (req.body.nombre || '').toLowerCase(),
                    (req.body['segundo nombre'] || '').toLowerCase(), // Si existe
                    (req.body.apellido || '').toLowerCase(),
                    (req.body['segundo apellido'] || '').toLowerCase(), // Si existe
                    (req.body['numero de documento'] || '').toLowerCase()
                ].filter(Boolean), // Elimina elementos vacíos
                fechaCreacion: new Date(),
                fechaActualizacion: new Date()
            };

            const nuevoEstudiante = await estudianteService.crearEstudiante(estudianteData);
            res.status(201).json(nuevoEstudiante);
        } catch (error) {
            console.error('Error en crearEstudiante (Controller):', error);
            // Si el error ya es un 400, no lo envuelvas en un 500 genérico.
            if (res.statusCode === 400) { // Si ya hemos enviado un 400 en la validación inicial
                res.json({ error: error.message || "Error al crear estudiante" });
            } else {
                res.status(500).json({ error: "Error al crear estudiante", details: error.message });
            }
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

            // Asegúrate de que los campos para searchKeywords también usen los nombres de Firestore
            if (req.body.nombre || req.body.apellido || req.body['numero de documento'] || req.body['segundo nombre'] || req.body['segundo apellido']) {
                updateData.searchKeywords = [
                    (req.body.nombre || '').toLowerCase(),
                    (req.body['segundo nombre'] || '').toLowerCase(),
                    (req.body.apellido || '').toLowerCase(),
                    (req.body['segundo apellido'] || '').toLowerCase(),
                    (req.body['numero de documento'] || '').toLowerCase()
                ].filter(Boolean);
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
            const { tipo, numero } = req.query; // Estos son 'tipo' y 'numero' como strings en la URL

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

    return {
        crearEstudiante,
        obtenerEstudiantes,
        actualizarEstudiante,
        buscarPorDocumento,
        obtenerEstudiantePorId,
        eliminarEstudiante,
        getTiposDocumento,
        getFacultades
    };
}