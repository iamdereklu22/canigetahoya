// src/dataService.js
import { doc, setDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Ensure firebaseConfig is properly set up
  
  const initialNotes = {
    1: { 
      t1: { time: "2:00PM", author: "Dr. Smith", location: "ABC Hospital", text: "Initial notes for John Doe." },
      t2: { time: "1:00PM", author: "Dr. Smith", location: "ABC Hospital", text: "Follow-up notes for John Doe." }
    },
    2: { 
      t3: { time: "2:00PM", author: "Dr. Adams", location: "XYZ Clinic", text: "Jane Smith recovery notes." }
    },
    3: { 
      t4: { time: "1:00PM", author: "Dr. Patel", location: "High Street Medical", text: "Emily's check-up." }
    }
  };
  
  // Simulate fetching data (later replace with Firebase calls)
  export const getPatients = (setPatients) => {
    const patientsRef = collection(db, "patient_info");
  
    return onSnapshot(patientsRef, (snapshot) => {
      const patientsData = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.patient_info) {
          patientsData[doc.id] = { id: doc.id, ...data.patient_info }; // Extract patient_info
        }
      });
      console.log("Fetched Patients:", patientsData); // Debugging
      setPatients(patientsData);
    }, (error) => {
      console.error("Error fetching real-time patients:", error);
    });
  };

  export const updatePatient = async (patientId, updatedData) => {
    try {
      const patientRef = doc(db, "patient_info", patientId);
      await setDoc(patientRef, updatedData, { merge: true });
      console.log(`Updated patient ${patientId} successfully.`);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };
  
  export const getNotes = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialNotes), 500);
    });
  };
  
  // Function to update a note (in local state)
  export const updateNote = (patients, setNotes, patientId, noteId, newText) => {
    setNotes((prev) => ({
      ...prev,
      [patientId]: { 
        ...prev[patientId], 
        [noteId]: { ...prev[patientId][noteId], text: newText } 
      }
    }));
  };