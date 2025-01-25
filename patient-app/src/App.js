// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientPage from "./PatientPage";
import TextPage from "./TextPage"; 
import { getPatients, getNotes, updateNote } from "./dataService"; // Import data functions

function App() {
  const [patients, setPatients] = useState({});
  const [notes, setNotes] = useState({});

  // Load patient and notes data when app starts
  useEffect(() => {
    getPatients().then(setPatients);
    getNotes().then(setNotes);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage patients={patients} />} />
        <Route path="/patient/:id" element={<PatientPage patients={patients} setPatients={setPatients} notes={notes} />} />
        <Route path="/text/:id/:noteId" element={<TextPage notes={notes} updateText={(id, noteId, text) => updateNote(patients, setNotes, id, noteId, text)} />} />
      </Routes>
    </Router>
  );
}

export default App;