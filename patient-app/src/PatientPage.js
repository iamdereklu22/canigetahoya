import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const patientData = {
  1: { name: "John Doe", dob: "1990-01-01", details: "Patient has mild allergies." },
  2: { name: "Jane Smith", dob: "1985-05-15", details: "Recovering from surgery." },
  3: { name: "Emily Johnson", dob: "2000-07-20", details: "Annual check-up due." },
};

// Mock text entries for each patient
const textEntries = {
  1: [
    { id: "t1", time: "10:00 AM", author: "Dr. Smith", location: "Room 101", mp3: "audio1.mp3" },
    { id: "t2", time: "1:30 PM", author: "Dr. Smith", location: "Room 102", mp3: "audio2.mp3" }
  ],
  2: [
    { id: "t3", time: "9:00 AM", author: "Dr. Adams", location: "Room 202", mp3: "audio3.mp3" }
  ],
  3: [
    { id: "t4", time: "3:45 PM", author: "Dr. Patel", location: "Room 303", mp3: "audio4.mp3" },
    { id: "t5", time: "4:15 PM", author: "Dr. Patel", location: "Room 304", mp3: "audio5.mp3" }
  ],
};

const PatientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = patientData[id];
  const texts = textEntries[id] || [];

  if (!patient) return <h2>Patient not found</h2>;

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backButton}>← Back</Link>
      <h2>Patient Page</h2>

      {/* Patient details */}
      <div style={styles.card}>
        <h3>{patient.name}</h3>
        <p><strong>DOB:</strong> {patient.dob}</p>
        <p><strong>Details:</strong> {patient.details}</p>
      </div>

      {/* List of text entries */}
      <h3>Text Entries</h3>
      <ul style={styles.list}>
        {texts.map((text) => (
          <li key={text.id} style={styles.listItem}>
            <button style={styles.textButton} onClick={() => navigate(`/text/${id}/${text.id}`)}>
              {text.time} | {text.author} | {text.location}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  backButton: { textDecoration: "none", fontSize: "16px", marginBottom: "10px", display: "block" },
  card: { padding: "15px", background: "#e0e0e0", borderRadius: "5px", marginBottom: "10px" },
  list: { listStyle: "none", padding: 0 },
  listItem: { marginBottom: "8px" },
  textButton: { width: "100%", padding: "10px", background: "#4CAF50", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }
};

export default PatientPage;