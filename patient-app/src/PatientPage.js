import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./PatientPage.css"; // Import the CSS file

const PatientPage = ({ patients, setPatients, notes }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState(patients[id] || {});
  const patientNotes = notes[id] || {};
  const [sortField, setSortField] = useState("time");
  const [sortOrder, setSortOrder] = useState("asc");

  if (!patient) return <h2>Patient not found</h2>;

  const updateField = (field, value) => {
    setPatient((prev) => {
      const updatedPatient = { ...prev, [field]: value };
      setPatients((prevPatients) => ({
        ...prevPatients,
        [id]: updatedPatient, // Update the global patients state
      }));
      return updatedPatient;
    });
  };

  const toggleSex = (sex) => {
    setPatient((prev) => {
      const updatedPatient = { ...prev, sex };
      setPatients((prevPatients) => ({
        ...prevPatients,
        [id]: updatedPatient, // Persist the update globally
      }));
      return updatedPatient;
    });
  };

  const handleSearchPatient = (e) => {
    if (e.key === "Enter") {
      const foundPatientId = Object.keys(patients).find(
        (pid) =>
          patients[pid].firstName.toLowerCase().includes(search.toLowerCase()) ||
          patients[pid].lastName.toLowerCase().includes(search.toLowerCase())
      );
      if (foundPatientId) navigate(`/patient/${foundPatientId}`);
    }
  };

  const sortedNotes = Object.keys(patientNotes).sort((a, b) => {
    const valA = patientNotes[a][sortField];
    const valB = patientNotes[b][sortField];
    return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="backButton">← Back</Link>
        <span className="userIcon">👤 Username</span>
      </header>

      <input
        type="text"
        placeholder="Search and switch patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearchPatient}
        className="searchBar"
      />

      <div className="infoContainer">
        <div className="column">
          <label><span>Last Name:</span> <input type="text" value={patient.lastName} onChange={(e) => updateField("lastName", e.target.value)} /></label>
          <label><span>DOB:</span> <input type="date" value={patient.dob} onChange={(e) => updateField("dob", e.target.value)} /></label>
          <label><span>Address:</span> <input type="text" value={patient.address || ""} onChange={(e) => updateField("address", e.target.value)} /></label>
          <label><span>Phone:</span> <input type="text" value={patient.phone || ""} onChange={(e) => updateField("phone", e.target.value)} /></label>
          <label>
            <span>Email:</span> 
            <input type="email" value={patient.email || ""} onChange={(e) => updateField("email", e.target.value)} className="emailInput" />
          </label>
        </div>
        <div className="column">
          <label><span>First Name:</span> <input type="text" value={patient.firstName} onChange={(e) => updateField("firstName", e.target.value)} /></label>
          <label className="sexLabel">
            <span>Sex:</span> 
            <button onClick={() => toggleSex("M")} className={`sexButton ${patient.sex === "M" ? "active" : ""}`}>M</button>
            <button onClick={() => toggleSex("F")} className={`sexButton ${patient.sex === "F" ? "active" : ""}`}>F</button>
          </label>
          <label><span>First Visit:</span> <input type="date" value={patient.firstVisit || ""} onChange={(e) => updateField("firstVisit", e.target.value)} /></label>
          <label><span>Last Visit:</span> <input type="date" value={patient.lastVisit || ""} onChange={(e) => updateField("lastVisit", e.target.value)} /></label>
        </div>
      </div>

      <div className="infoContainer">
        <div className="column">
            <label><span>Allergies:</span> <input type="text" value={patient.allergies || ""} onChange={(e) => updateField("allergies", e.target.value)} /></label>
            <label><span>Medications:</span> <input type="text" value={patient.medications || ""} onChange={(e) => updateField("medications", e.target.value)} /></label>
        </div>
        <div className="column">
            <label><span>Height:</span> <input type="text" value={patient.height || ""} onChange={(e) => updateField("height", e.target.value)} /></label>
            <label><span>Weight:</span> <input type="text" value={patient.weight || ""} onChange={(e) => updateField("weight", e.target.value)} /></label>
        </div>    
      </div>


      <h3>Notes</h3>
      <div className="tableContainer">
        <div className="tableHeader">
          <span onClick={() => toggleSort("time")} className="columnHeader">Time {sortField === "time" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
          <span onClick={() => toggleSort("author")} className="columnHeader">Author {sortField === "author" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
          <span onClick={() => toggleSort("location")} className="columnHeader">Location {sortField === "location" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
        </div>
        {sortedNotes.map((noteId) => (
          <Link to={`/text/${id}/${noteId}`} key={noteId} className="patientRow">
            <span className="highlight">{patientNotes[noteId].time}</span>
            <span>{patientNotes[noteId].author}</span>
            <span>{patientNotes[noteId].location}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PatientPage;