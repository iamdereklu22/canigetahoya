import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Storage

const firebaseConfig = {
  apiKey: "AIzaSyCa6AqyA-sPiHV5xSbvp72nty0XnUH1OLc",
  authDomain: "hoyahacks-54bf3.firebaseapp.com",
  projectId: "hoyahacks-54bf3",
  storageBucket: "hoyahacks-54bf3.firebasestorage.app",
  messagingSenderId: "484579306298",
  appId: "1:484579306298:web:488141046c3ad937387e03",
  measurementId: "G-NZ4TNSL8D0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const storage = getStorage(app, "gs://audio_files_recording"); // ✅ Initialize Storage

export { db, storage }; // ✅ Export Firestore & Storage