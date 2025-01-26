import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addNewPatient } from "./dataService"; // Import function
import { utcToLocal, utcToLocalDisplay } from "./timeUtils"; // Import helper
import "./HomePage.css"; // ✅ Import the updated CSS file

const HomePage = ({ patients }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [hoveredRow, setHoveredRow] = useState(null);
  const navigate = useNavigate();

  console.log(hoveredRow); // ✅ unused variable

  // Sorting function (restored)
  const sortedPatients = Object.keys(patients)
    .filter((id) => {
      const firstName = patients[id]?.firstName || "";
      const lastName = patients[id]?.lastName || "";
      return (
        firstName.toLowerCase().includes(search.toLowerCase()) ||
        lastName.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      const getLastVisit = (patient) =>
        patient?.lastVisit ? utcToLocal(patient.lastVisit) : "";

      const valA =
        sortField === "name"
          ? `${patients[a]?.firstName || ""} ${patients[a]?.lastName || ""}`
          : getLastVisit(patients[a]);

      const valB =
        sortField === "name"
          ? `${patients[b]?.firstName || ""} ${patients[b]?.lastName || ""}`
          : getLastVisit(patients[b]);

      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  // Toggle sorting function (restored)
  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Add patient function
  const handleAddPatient = async () => {
    const newPatientId = await addNewPatient();
    if (newPatientId) {
      navigate(`/patient/${newPatientId}`);
    }
  };

  return (
    <div className="header-container">
      {/* Header with proper spacing */}
      <header className="header-header">
        <h2 className="header-pageTitle">🩺 MedDocs Portal</h2>
        <div className="header-right">
          <input
            type="text"
            placeholder="🔍 Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="header-searchBar"
          />
          <button onClick={handleAddPatient} className="header-addButton">
            ➕ Add Patient
          </button>
          <span className="header-userIcon">👤 Derek Lu</span>
        </div>
      </header>

      <div className="header-hero">
        <h1>Welcome to Your Patient Portal</h1>
        <p>Effortlessly manage patient records, notes, and more.</p>
      </div>

      {/* Patient Table */}
      <div className="header-tableContainer">
        <div className="header-tableHeader">
          <span
            onClick={() => toggleSort("name")}
            className="header-columnHeader"
          >
            Patient Name{" "}
            {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </span>
          <span
            onClick={() => toggleSort("lastVisit")}
            className="header-columnHeader"
          >
            Last Modified{" "}
            {sortField === "lastVisit" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </span>
        </div>

        {sortedPatients.map((id) => (
          <Link
            to={`/patient/${id}`}
            key={id}
            className="header-patientRow"
            onMouseEnter={() => setHoveredRow(id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <span className="header-highlight">
              {patients[id].firstName} {patients[id].lastName}
            </span>
            <span className="header-dateText">
              {patients[id].lastVisit
                ? utcToLocalDisplay(patients[id].lastVisit)
                : "N/A"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
