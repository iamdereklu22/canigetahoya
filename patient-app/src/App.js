import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientPage from "./PatientPage";
import TextPage from "./TextPage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/patient/:id" element={<PatientPage />} />
        <Route path="/text/:id/:textId" element={<TextPage />} /> {/* Updated Route */}
      </Routes>
    </Router>
  );
}

export default App;