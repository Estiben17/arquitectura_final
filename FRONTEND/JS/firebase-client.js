// FRONTEND/JS/firebase-client.js (ESTE ES EL ÚNICO LUGAR EN EL FRONTEND CON ESTA CONFIG)

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Opcional
import { getFirestore } from "firebase/firestore"; // Para usar Firestore directamente en frontend
import { getAuth } from "firebase/auth"; // Para autenticación en frontend

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
const analytics = getAnalytics(app); // Opcional
export const db = getFirestore(app); // Instancia de Firestore para el cliente
export const auth = getAuth(app);   // Instancia de Auth para el cliente

export default app;