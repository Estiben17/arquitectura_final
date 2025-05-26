// BACKEND/firebase.js (Este es el que inicializa el SDK Admin)

import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE || 'firebaseKey.json';

let serviceAccount;
try {
    serviceAccount = require(path.resolve(__dirname, serviceAccountPath));
} catch (error) {
    console.error(`ERROR: No se pudo cargar el archivo de cuenta de servicio '${serviceAccountPath}'.`);
    console.error('Asegúrate de que el archivo exista en la carpeta BACKEND/ y el nombre sea correcto.');
    process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com` // Opcional
});

export const db = admin.firestore(); // Exporta la instancia de Firestore del Admin SDK
export const auth = admin.auth();   // Exporta la instancia de Auth del Admin SDK
export { admin }; // Exporta el objeto admin completo si lo necesitas