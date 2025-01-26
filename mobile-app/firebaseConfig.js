import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Storage

const firebaseConfig = {
    apiKey: "AIzaSyCa6AqyA-sPiHV5xSbvp72nty0XnUH1OLc",
    authDomain: "hoyahacks-54bf3.firebaseapp.com",
    projectId: "hoyahacks-54bf3",
    storageBucket: "hoyahacks-54bf3.appspot.com", // ✅ Corrected storage bucket
    messagingSenderId: "484579306298",
    appId: "1:484579306298:web:d0b0f3355450cb90387e03",
    measurementId: "G-08VGM953H3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize Storage

export { db, storage }; // ✅ Export Firestore & Storage