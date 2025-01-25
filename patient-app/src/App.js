// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientPage from "./PatientPage";
import TextPage from "./TextPage"; 
import PatientInfo from "./PatientInfo"; // Import PatientInfo component
import { getPatients, getNotes, updateNote } from "./dataService"; // Import data functions
import { db } from "./firebaseConfig"; // Import Firestore database
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

function App() {
  const [patients, setPatients] = useState({});
  const [notes, setNotes] = useState({});

  // Load patient and notes data when app starts
  useEffect(() => {
    getPatients().then(setPatients);
    getNotes().then(setNotes);
    fetchAllPatients(); // Fetch all patients
  }, []);

  // Fetch all patients from Firestore
  const fetchAllPatients = async () => {
    const querySnapshot = await getDocs(collection(db, "patient_info"));
    const patients = [];
    querySnapshot.forEach((doc) => {
      patients.push({ id: doc.id, ...doc.data() });
    });
    console.log(patients); // List of all patients
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage patients={patients} />} />
        <Route path="/patient/:id" element={<PatientPage patients={patients} setPatients={setPatients} notes={notes} />} />
        <Route path="/text/:id/:noteId" element={<TextPage notes={notes} updateText={(id, noteId, text) => updateNote(patients, setNotes, id, noteId, text)} />} />
        <Route path="/patient-info" element={<PatientInfo />} /> {/* Add route for PatientInfo */}
      </Routes>
    </Router>
  );
}

export default App;