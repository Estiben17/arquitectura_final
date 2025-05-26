// BACKEND/Controller/departamentoController.js

// =======================================================================================
// PASO CLAVE: Importa la FUNCIÓN que crea tu servicio de departamento
import createDepartamentoService from '../Service/departamentoService.js';
// Asegúrate de que el 'departamentoService.js' está correcto y no es el de estudiante.
// Si el archivo 'estudianteService.js' que me subiste antes (con la lógica de departamento)
// es el que estás usando como 'departamentoService.js', asegúrate de que el nombre del archivo
// en el disco sea realmente 'departamentoService.js'.
// =======================================================================================

// =======================================================================================
// PASO CLAVE: Exporta una FUNCIÓN que "crea" tu controlador de departamento
// y RECIBE 'db' y 'auth' (del Admin SDK)
export default function createDepartamentoController(db, auth) {
    // Instancia el servicio de departamento, pasándole 'db' y 'auth'
    const departamentoService = createDepartamentoService(db, auth);

    /**
     * Controlador para obtener todos los departamentos.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} res - Objeto de respuesta de Express.
     */
    const obtenerDepartamentos = async (req, res) => {
        try {
            const filtros = req.query; // Los filtros como 'estado' o 'busqueda' vendrán aquí
            const departamentos = await departamentoService.obtenerDepartamentos(filtros);
            res.status(200).json(departamentos);
        } catch (error) {
            console.error("Error en departamentoController.obtenerDepartamentos:", error);
            res.status(500).json({ message: "Error al obtener departamentos", error: error.message });
        }
    };

    /**
     * Controlador para obtener un departamento por su ID.
     * @param {Object} req - Objeto de solicitud de Express (contiene req.params.id).
     * @param {Object} res - Objeto de respuesta de Express.
     */
    const obtenerDepartamento = async (req, res) => {
        try {
            const { id } = req.params;
            const departamento = await departamentoService.obtenerDepartamentoPorId(id);
            if (departamento) {
                res.status(200).json(departamento);
            } else {
                res.status(404).json({ message: "Departamento no encontrado." });
            }
        } catch (error) {
            console.error("Error en departamentoController.obtenerDepartamento:", error);
            res.status(500).json({ message: "Error al obtener departamento", error: error.message });
        }
    };

    /**
     * Controlador para actualizar un departamento existente.
     * @param {Object} req - Objeto de solicitud de Express (contiene req.params.id y req.body).
     * @param {Object} res - Objeto de respuesta de Express.
     */
    const actualizarDepartamento = async (req, res) => {
        try {
            const { id } = req.params;
            const nuevosDatos = req.body;
            await departamentoService.actualizarDepartamento(id, nuevosDatos);
            res.status(200).json({ message: "Departamento actualizado con éxito." });
        } catch (error) {
            console.error("Error en departamentoController.actualizarDepartamento:", error);
            res.status(500).json({ message: "Error al actualizar departamento", error: error.message });
        }
    };

    /**
     * Controlador para obtener estadísticas de un departamento.
     * @param {Object} req - Objeto de solicitud de Express (contiene req.params.id).
     * @param {Object} res - Objeto de respuesta de Express.
     */
    const obtenerEstadisticas = async (req, res) => {
        try {
            const { id } = req.params;
            const estadisticas = await departamentoService.obtenerEstadisticasDepartamento(id);
            res.status(200).json(estadisticas);
        } catch (error) {
            console.error("Error en departamentoController.obtenerEstadisticas:", error);
            res.status(500).json({ message: "Error al obtener estadísticas del departamento", error: error.message });
        }
    };

    /**
     * Controlador para buscar un estudiante por documento.
     * NOTA: Esta función es más lógica de estudiante, pero si tu router de departamento
     * tiene una ruta para esto, el controlador de departamento puede llamarla.
     * Asegúrate de que tu `departamentoService` tiene `buscarEstudiantePorDocumento`.
     * @param {Object} req - Objeto de solicitud de Express (contiene req.query.tipoDocumento, req.query.numeroDocumento).
     * @param {Object} res - Objeto de respuesta de Express.
     */
    const buscarEstudiante = async (req, res) => {
        try {
            const { tipoDocumento, numeroDocumento } = req.query; // Asumo que se esperan como query parameters
            if (!tipoDocumento || !numeroDocumento) {
                return res.status(400).json({ message: "Tipo de documento y número de documento son obligatorios." });
            }
            const estudiante = await departamentoService.buscarEstudiantePorDocumento(tipoDocumento, numeroDocumento);
            if (estudiante) {
                res.status(200).json(estudiante);
            } else {
                res.status(404).json({ message: "Estudiante no encontrado con los criterios proporcionados." });
            }
        } catch (error) {
            console.error("Error en departamentoController.buscarEstudiante:", error);
            res.status(500).json({ message: "Error al buscar estudiante", error: error.message });
        }
    };


    // PASO CLAVE: Retorna un objeto con todas las funciones controladoras
    // que este módulo proporciona. Estas son las funciones que el router espera.
    return {
        obtenerDepartamentos,
        obtenerDepartamento,
        actualizarDepartamento,
        obtenerEstadisticas,
        buscarEstudiante // Incluir si tu router de departamento usa esta ruta
    };
}