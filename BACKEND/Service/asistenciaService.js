import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  Timestamp
} from "firebase/firestore";

// Configuración de Firebase (la misma que usaste para asignaturas)
const firebaseConfig = {
  apiKey: "AIzaSyC0DPrKhgG7Wt46qlNqcNpf1rkgjRbSmBg",
  authDomain: "registro-de-colegio.firebaseapp.com",
  projectId: "registro-de-colegio",
  storageBucket: "registro-de-colegio.appspot.com",
  messagingSenderId: "66400564127",
  appId: "1:66400564127:web:be34d8ea4361665a1183aa",
  measurementId: "G-B11W53HT89"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const asistenciasCollection = collection(db, "asistencias");
const estudiantesCollection = collection(db, "estudiantes");

const asistenciaService = {
  /**
   * Crea un nuevo registro de asistencia
   * @param {Object} datosAsistencia - Datos de la asistencia
   * @returns {Promise<Object>} Asistencia creada con ID
   */
  async crearAsistencia(datosAsistencia) {
    try {
      // Validación de datos requeridos
      if (!datosAsistencia.idAsignatura || !datosAsistencia.fecha) {
        throw new Error("Asignatura y fecha son campos obligatorios");
      }

      // Convertir fecha a Timestamp de Firebase
      const asistenciaData = {
        ...datosAsistencia,
        fecha: Timestamp.fromDate(new Date(datosAsistencia.fecha)),
        horaInicio: datosAsistencia.horaInicio || null,
        horaFin: datosAsistencia.horaFin || null,
        estudiantes: datosAsistencia.estudiantes || [],
        fechaCreacion: Timestamp.now()
      };

      const docRef = await addDoc(asistenciasCollection, asistenciaData);
      
      return { 
        id: docRef.id, 
        ...asistenciaData 
      };
    } catch (error) {
      console.error("Error en crearAsistencia:", error);
      throw new Error(`Error al crear asistencia: ${error.message}`);
    }
  },

  /**
   * Obtiene todas las asistencias con filtros opcionales
   * @param {Object} filtros - Objeto con filtros de búsqueda
   * @returns {Promise<Array>} Lista de asistencias
   */
  async obtenerAsistencias(filtros = {}) {
    try {
      // Construir consulta con filtros
      let q = query(asistenciasCollection);
      
      if (filtros.idAsignatura && filtros.idAsignatura !== 'all') {
        q = query(q, where("idAsignatura", "==", filtros.idAsignatura));
      }
      
      if (filtros.grupo && filtros.grupo !== 'all') {
        q = query(q, where("grupo", "==", filtros.grupo));
      }
      
      if (filtros.semestre && filtros.semestre !== 'all') {
        q = query(q, where("semestre", "==", filtros.semestre));
      }
      
      if (filtros.fechaDesde) {
        q = query(q, where("fecha", ">=", Timestamp.fromDate(new Date(filtros.fechaDesde))));
      }
      
      if (filtros.fechaHasta) {
        q = query(q, where("fecha", "<=", Timestamp.fromDate(new Date(filtros.fechaHasta))));
      }

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convertir Timestamp a fecha legible
          fecha: data.fecha.toDate().toLocaleDateString(),
          horaInicio: data.horaInicio || '--:--',
          horaFin: data.horaFin || '--:--'
        };
      });
    } catch (error) {
      console.error("Error en obtenerAsistencias:", error);
      throw new Error(`Error al obtener asistencias: ${error.message}`);
    }
  },

  /**
   * Registra la asistencia de un estudiante
   * @param {string} idAsistencia - ID del registro de asistencia
   * @param {Object} datosEstudiante - Datos del estudiante y su asistencia
   * @returns {Promise<void>}
   */
  async registrarAsistenciaEstudiante(idAsistencia, datosEstudiante) {
    try {
      const asistenciaRef = doc(db, "asistencias", idAsistencia);
      
      // Primero obtenemos el documento actual
      const docSnapshot = await getDoc(asistenciaRef);
      const estudiantes = docSnapshot.data().estudiantes || [];
      
      // Verificamos si el estudiante ya está registrado
      const index = estudiantes.findIndex(e => e.idEstudiante === datosEstudiante.idEstudiante);
      
      if (index >= 0) {
        // Actualizar registro existente
        estudiantes[index] = datosEstudiante;
      } else {
        // Agregar nuevo registro
        estudiantes.push(datosEstudiante);
      }
      
      // Actualizar el documento
      await updateDoc(asistenciaRef, {
        estudiantes,
        fechaActualizacion: Timestamp.now()
      });
    } catch (error) {
      console.error("Error en registrarAsistenciaEstudiante:", error);
      throw new Error(`Error al registrar asistencia: ${error.message}`);
    }
  },

  /**
   * Obtiene estudiantes para una asignatura/grupo
   * @param {string} idAsignatura - ID de la asignatura
   * @param {string} grupo - Grupo de la asignatura
   * @returns {Promise<Array>} Lista de estudiantes
   */
  async obtenerEstudiantesParaAsistencia(idAsignatura, grupo) {
    try {
      const q = query(
        estudiantesCollection, 
        where("asignaturas", "array-contains", idAsignatura),
        where("grupo", "==", grupo)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error en obtenerEstudiantesParaAsistencia:", error);
      throw new Error(`Error al obtener estudiantes: ${error.message}`);
    }
  }
};

export default asistenciaService;