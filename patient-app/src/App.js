import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientPage from "./PatientPage";
import TextPage from "./TextPage"; 
import PatientInfo from "./PatientInfo";
import { getPatients, getNotes, updateNote } from "./dataService";

function App() {
  const [patients, setPatients] = useState({});
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const unsubscribePatients = getPatients(setPatients);
    getNotes().then(setNotes);
    
    return () => {
      unsubscribePatients();
    };
  }, []);
  
  useEffect(() => {
    console.log("Updated Patients State:", patients); // Debugging Log
  }, [patients]); // Log whenever `patients` state updates

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage patients={patients} />} />
        <Route path="/patient/:id" element={<PatientPage patients={patients} setPatients={setPatients} notes={notes} />} />
        <Route path="/text/:id/:noteId" element={<TextPage notes={notes} updateText={(id, noteId, text) => updateNote(patients, setNotes, id, noteId, text)} />} />
        <Route path="/patient-info" element={<PatientInfo />} />
      </Routes>
    </Router>
  );
}

export default App;