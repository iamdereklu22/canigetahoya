import React from "react";
import { useParams, Link } from "react-router-dom";

const patientData = {
  1: { name: "John Doe", dob: "1990-01-01", details: "Patient has mild allergies." },
  2: { name: "Jane Smith", dob: "1985-05-15", details: "Recovering from surgery." },
  3: { name: "Emily Johnson", dob: "2000-07-20", details: "Annual check-up due." },
};

const PatientPage = () => {
  const { id } = useParams();
  const patient = patientData[id];

  if (!patient) return <h2>Patient not found</h2>;

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backButton}>← Back</Link>
      <h2>Patient Page</h2>
      <div style={styles.card}>
        <h3>{patient.name}</h3>
        <p><strong>DOB:</strong> {patient.dob}</p>
        <p><strong>Details:</strong> {patient.details}</p>
      </div>
      <textarea placeholder="Enter text..." style={styles.textArea}></textarea>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  backButton: { textDecoration: "none", fontSize: "16px", marginBottom: "10px", display: "block" },
  card: { padding: "15px", background: "#e0e0e0", borderRadius: "5px", marginBottom: "10px" },
  textArea: { width: "100%", height: "100px", padding: "10px" },
};

export default PatientPage;