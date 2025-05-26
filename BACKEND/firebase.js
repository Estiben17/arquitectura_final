// BACKEND/firebase.js (Este es el que inicializa el SDK Admin)

import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url'; 
import fs from 'fs'; 
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountFileName = process.env.FIREBASE_SERVICE_ACCOUNT_FILE || 'firebaseKey.json';
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

export const db = admin.firestore(); 
export const auth = admin.auth();    
export { admin }; 

console.log('Conectado a Firebase Firestore (Admin SDK).'); 