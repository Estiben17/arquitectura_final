// Importaciones de Firebase
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  updateDoc,
  deleteDoc 
} from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC0DPrKhgG7Wt46qlNqcNpf1rkgjRbSmBg",
  authDomain: "registro-de-colegio.firebaseapp.com",
  projectId: "registro-de-colegio",
  storageBucket: "registro-de-colegio.appspot.com",
  messagingSenderId: "66400564127",
  appId: "1:66400564127:web:be34d8ea4361665a1183aa",
  measurementId: "G-B11W53HT89"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias a colecciones
const asignaturasCollection = collection(db, "asignaturas");

/**
 * Servicio para gestión de asignaturas
 */
const asignaturaService = {
  /**
   * Crea una nueva asignatura
   * @param {Object} datosAsignatura - Datos de la asignatura a crear
   * @returns {Promise<Object>} Asignatura creada con ID
   */
  async crearAsignatura(datosAsignatura) {
    try {
      // Validación básica de datos
      if (!datosAsignatura.codigo || !datosAsignatura.nombre) {
        throw new Error("Código y nombre son campos obligatorios");
      }

      const docRef = await addDoc(asignaturasCollection, {
        ...datosAsignatura,
        fechaCreacion: new Date().toISOString()
      });
      
      return { 
        id: docRef.id, 
        ...datosAsignatura 
      };
    } catch (error) {
      console.error("Error en crearAsignatura:", error);
      throw new Error(`Error al crear asignatura: ${error.message}`);
    }
  },

  /**
   * Obtiene todas las asignaturas
   * @returns {Promise<Array>} Lista de asignaturas
   */
  async obtenerAsignaturas() {
    try {
      const querySnapshot = await getDocs(asignaturasCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error en obtenerAsignaturas:", error);
      throw new Error(`Error al obtener asignaturas: ${error.message}`);
    }
  },

  /**
   * Actualiza una asignatura existente
   * @param {string} id - ID de la asignatura
   * @param {Object} nuevosDatos - Datos a actualizar
   * @returns {Promise<void>}
   */
  async actualizarAsignatura(id, nuevosDatos) {
    try {
      const docRef = doc(db, "asignaturas", id);
      await updateDoc(docRef, {
        ...nuevosDatos,
        fechaActualizacion: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error en actualizarAsignatura:", error);
      throw new Error(`Error al actualizar asignatura: ${error.message}`);
    }
  },

  /**
   * Elimina una asignatura
   * @param {string} id - ID de la asignatura a eliminar
   * @returns {Promise<void>}
   */
  async eliminarAsignatura(id) {
    try {
      const docRef = doc(db, "asignaturas", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error en eliminarAsignatura:", error);
      throw new Error(`Error al eliminar asignatura: ${error.message}`);
    }
  }
};

export default asignaturaService;
