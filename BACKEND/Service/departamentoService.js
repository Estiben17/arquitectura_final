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
  getDoc
} from "firebase/firestore";

// Configuración de Firebase (la misma que usaste antes)
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

const departamentosCollection = collection(db, "departamentos");
const estudiantesCollection = collection(db, "estudiantes");
const profesoresCollection = collection(db, "profesores");
const asignaturasCollection = collection(db, "asignaturas");

const departamentoService = {
  /**
   * Obtiene todos los departamentos con filtros opcionales
   * @param {Object} filtros - Objeto con filtros de búsqueda
   * @returns {Promise<Array>} Lista de departamentos
   */
  async obtenerDepartamentos(filtros = {}) {
    try {
      let q = query(departamentosCollection);
      
      if (filtros.estado && filtros.estado !== 'all') {
        q = query(q, where("estado", "==", filtros.estado));
      }
      
      if (filtros.busqueda) {
        q = query(q, where("nombre", ">=", filtros.busqueda));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error en obtenerDepartamentos:", error);
      throw new Error(`Error al obtener departamentos: ${error.message}`);
    }
  },

  /**
   * Obtiene un departamento por su ID
   * @param {string} id - ID del departamento
   * @returns {Promise<Object>} Datos del departamento
   */
  async obtenerDepartamentoPorId(id) {
    try {
      const docRef = doc(db, "departamentos", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("No se encontró el departamento");
      }
    } catch (error) {
      console.error("Error en obtenerDepartamentoPorId:", error);
      throw new Error(`Error al obtener departamento: ${error.message}`);
    }
  },

  /**
   * Actualiza un departamento
   * @param {string} id - ID del departamento
   * @param {Object} nuevosDatos - Datos a actualizar
   * @returns {Promise<void>}
   */
  async actualizarDepartamento(id, nuevosDatos) {
    try {
      const docRef = doc(db, "departamentos", id);
      await updateDoc(docRef, {
        ...nuevosDatos,
        fechaActualizacion: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error en actualizarDepartamento:", error);
      throw new Error(`Error al actualizar departamento: ${error.message}`);
    }
  },

  /**
   * Obtiene estadísticas de un departamento
   * @param {string} idDepartamento - ID del departamento
   * @returns {Promise<Object>} Objeto con estadísticas
   */
  async obtenerEstadisticasDepartamento(idDepartamento) {
    try {
      // Obtener estudiantes del departamento
      const qEstudiantes = query(
        estudiantesCollection, 
        where("idDepartamento", "==", idDepartamento)
      );
      const estudiantesSnapshot = await getDocs(qEstudiantes);
      
      // Obtener profesores del departamento
      const qProfesores = query(
        profesoresCollection, 
        where("idDepartamento", "==", idDepartamento)
      );
      const profesoresSnapshot = await getDocs(qProfesores);
      
      // Obtener asignaturas del departamento
      const qAsignaturas = query(
        asignaturasCollection, 
        where("idDepartamento", "==", idDepartamento)
      );
      const asignaturasSnapshot = await getDocs(qAsignaturas);
      
      return {
        totalEstudiantes: estudiantesSnapshot.size,
        totalProfesores: profesoresSnapshot.size,
        totalAsignaturas: asignaturasSnapshot.size
      };
    } catch (error) {
      console.error("Error en obtenerEstadisticasDepartamento:", error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  },

  /**
   * Busca un estudiante por documento
   * @param {string} documento - Número de documento del estudiante
   * @returns {Promise<Object>} Datos del estudiante
   */
  async buscarEstudiantePorDocumento(documento) {
    try {
      const q = query(estudiantesCollection, where("documento", "==", documento));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    } catch (error) {
      console.error("Error en buscarEstudiantePorDocumento:", error);
      throw new Error(`Error al buscar estudiante: ${error.message}`);
    }
  }
};

export default departamentoService;