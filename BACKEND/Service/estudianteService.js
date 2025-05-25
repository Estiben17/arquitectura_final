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
  getDoc,
  deleteDoc,
  Timestamp
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const estudiantesCollection = collection(db, "estudiantes");

const estudianteService = {
  /**
   * Crea un nuevo estudiante
   */
  async crearEstudiante(datosEstudiante) {
    try {
      if (!datosEstudiante.nombres || !datosEstudiante.apellidos || !datosEstudiante.tipoDocumento || !datosEstudiante.numeroDocumento) {
        throw new Error("Todos los campos son obligatorios");
      }

      const estudianteData = {
        ...datosEstudiante,
        fechaCreacion: Timestamp.now(),
        estado: "activo"
      };

      const docRef = await addDoc(estudiantesCollection, estudianteData);
      return { id: docRef.id, ...estudianteData };
    } catch (error) {
      console.error("Error en crearEstudiante:", error);
      throw new Error(`Error al crear estudiante: ${error.message}`);
    }
  },

  /**
   * Obtiene todos los estudiantes con filtros opcionales
   */
  async obtenerEstudiantes(filtros = {}) {
    try {
      let q = query(estudiantesCollection);

      if (filtros.facultad && filtros.facultad !== 'all') {
        q = query(q, where("facultad", "==", filtros.facultad));
      }

      if (filtros.tipoDocumento && filtros.tipoDocumento !== 'all') {
        q = query(q, where("tipoDocumento", "==", filtros.tipoDocumento));
      }

      if (filtros.busqueda) {
        q = query(q, 
          where("nombres", ">=", filtros.busqueda),
          where("nombres", "<=", filtros.busqueda + '\uf8ff')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error en obtenerEstudiantes:", error);
      throw new Error(`Error al obtener estudiantes: ${error.message}`);
    }
  },

  /**
   * Actualiza un estudiante
   */
  async actualizarEstudiante(id, nuevosDatos) {
    try {
      const docRef = doc(db, "estudiantes", id);
      await updateDoc(docRef, {
        ...nuevosDatos,
        fechaActualizacion: Timestamp.now()
      });
    } catch (error) {
      console.error("Error en actualizarEstudiante:", error);
      throw new Error(`Error al actualizar estudiante: ${error.message}`);
    }
  },

  /**
   * Obtiene un estudiante por su ID
   */
  async obtenerEstudiantePorId(id) {
    try {
      const docRef = doc(db, "estudiantes", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Estudiante no encontrado");
      }
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error("Error en obtenerEstudiantePorId:", error);
      throw new Error(`Error al obtener estudiante: ${error.message}`);
    }
  },

  /**
   * Elimina un estudiante por ID
   */
  async eliminarEstudiante(id) {
    try {
      const docRef = doc(db, "estudiantes", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error en eliminarEstudiante:", error);
      throw new Error(`Error al eliminar estudiante: ${error.message}`);
    }
  },

  /**
   * Busca un estudiante por tipo y número de documento
   */
  async buscarPorDocumento(tipoDocumento, numeroDocumento) {
    try {
      const q = query(
        estudiantesCollection,
        where("tipoDocumento", "==", tipoDocumento),
        where("numeroDocumento", "==", numeroDocumento)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("Error en buscarPorDocumento:", error);
      throw new Error(`Error al buscar estudiante: ${error.message}`);
    }
  }
};

export default estudianteService;
