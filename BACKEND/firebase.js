// BACKEND/firebase.js (Este es el que inicializa el SDK Admin)

import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para __dirname en ES Modules
import fs from 'fs'; // Necesario para leer el archivo
import dotenv from 'dotenv';

dotenv.config();

// Obtener __dirname equivalente en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// La ruta al archivo de la cuenta de servicio desde .env
const serviceAccountFileName = process.env.FIREBASE_SERVICE_ACCOUNT_FILE || 'firebaseKey.json';
// Construir la ruta absoluta al archivo
const serviceAccountPath = path.resolve(__dirname, serviceAccountFileName);

let serviceAccount;
try {
    // Leer el archivo y parsear su contenido como JSON
    const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountContent);
} catch (error) {
    console.error(`ERROR: No se pudo cargar el archivo de cuenta de servicio '${serviceAccountPath}'.`);
    console.error('Asegúrate de que el archivo exista en la carpeta BACKEND/ y el nombre sea correcto, y que sea un JSON válido.');
    console.error('Detalle del error:', error.message);
    process.exit(1); // Detiene la aplicación si no se puede cargar la clave
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore(); // Exporta la instancia de Firestore del Admin SDK
export const auth = admin.auth();    // Exporta la instancia de Auth del Admin SDK
export { admin }; // Exporta el objeto admin completo si lo necesitas

console.log('Conectado a Firebase Firestore (Admin SDK).'); // Mensaje de éxito