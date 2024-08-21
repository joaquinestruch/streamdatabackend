import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuración de tu aplicación web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD74KDgGNPsfOY9H7uait-5n8HyMxqf_w8",
  authDomain: "streamdata-a562a.firebaseapp.com",
  projectId: "streamdata-a562a",
  storageBucket: "streamdata-a562a.appspot.com",
  messagingSenderId: "317811404631",
  appId: "1:317811404631:web:c1cd20730c8d33c9c11812",
  measurementId: "G-VTWCT1PS1E"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa Firestore
const db = getFirestore(app);

// Exporta los objetos necesarios
export { app, db, analytics };
