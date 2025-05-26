// BACKEND/Controller/asignaturaController.js

import createAsignaturaService from '../Service/asignaturaService.js';

export default function createAsignaturaController(db, auth) {

    const asignaturaService = createAsignaturaService(db, auth);
    

    const crearAsignaturaController = async (req, res) => {
        try {
            const datos = req.body;
            const nuevaAsignatura = await asignaturaService.crearAsignatura(datos); // Accede a través del objeto
            res.status(201).json(nuevaAsignatura);
        } catch (error) {
            console.error('Error en controlador al crear asignatura:', error);
            
            res.status(400).json({ mensaje: error.message });
        }
    };

    const obtenerAsignaturasController = async (req, res) => {
        try {
            const listaAsignaturas = await asignaturaService.obtenerAsignaturas(); // Accede a través del objeto
            res.status(200).json(listaAsignaturas);
        } catch (error) {
            console.error('Error en controlador al obtener asignaturas:', error);
            res.status(500).json({ mensaje: error.message });
        }
    };

    
    return {
        crearAsignaturaController,
        obtenerAsignaturasController,
        // (agregar aquí actualizarAsignaturaController, eliminarAsignaturaController si los implementas)
    };
    
}