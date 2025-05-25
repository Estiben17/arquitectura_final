
import asignaturaService from '../Service/asignaturaService.js';

// Si quieres extraer funciones para usarlas directamente
const { crearAsignatura, obtenerAsignaturas } = asignaturaService;

// Ejemplo de uso dentro de una función controladora para crear asignatura
export async function crearAsignaturaController(req, res) {
  try {
    const datos = req.body;
    const nuevaAsignatura = await crearAsignatura(datos);
    res.status(201).json(nuevaAsignatura);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

// Ejemplo para obtener asignaturas
export async function obtenerAsignaturasController(req, res) {
  try {
    const listaAsignaturas = await obtenerAsignaturas();
    res.status(200).json(listaAsignaturas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}
