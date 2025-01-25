import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import PatientPage from "./PatientPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/patient/:id" element={<PatientPage />} />
      </Routes>
    </Router>
  );
}

export default App;