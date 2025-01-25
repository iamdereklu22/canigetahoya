import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addNewPatient } from "./dataService"; // Import function
import { utcToLocal, utcToLocalDisplay } from "./timeUtils"; // Import the helper function

const HomePage = ({ patients }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

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

  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle adding new patient
  const handleAddPatient = async () => {
    const newPatientId = await addNewPatient();
    if (newPatientId) {
      navigate(`/patient/${newPatientId}`); // Redirect to the new patient page
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>🩺 Patient Portal</h2>
        <div style={styles.headerRight}>
          <input
            type="text"
            placeholder="🔍 Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchBar}
          />
          <button onClick={handleAddPatient} style={styles.addButton}>
            ➕ Add Patient
          </button>
          <span style={styles.userIcon}>👤 Derek Lu</span>
        </div>
      </header>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <span onClick={() => toggleSort("name")} style={styles.columnHeader}>
            Patient Name{" "}
            {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </span>
          <span
            onClick={() => toggleSort("lastVisit")}
            style={styles.columnHeader}
          >
            Last Modified{" "}
            {sortField === "lastVisit" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </span>
        </div>

        {sortedPatients.map((id) => (
          <Link to={`/patient/${id}`} key={id} style={styles.patientRow}>
            <span style={styles.highlight}>
              {patients[id].firstName} {patients[id].lastName}
            </span>
            <span style={styles.dateText}>
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

const styles = {
  dateText: {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#2E7D32", // Dark green for better visibility
    background: "#E8F5E9", // Light green background
    padding: "5px 10px",
    borderRadius: "5px",
    display: "inline-block",
    textAlign: "center",
    minWidth: "120px", // Ensures consistent width
  },
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    background: "#f4f6f9",
    height: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4CAF50" /* Modern green */,
    color: "white",
    padding: "15px 25px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  pageTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0",
  },

  userIcon: {
    fontSize: "16px",
    background: "#2e7d32",
    color: "white",
    padding: "8px 15px",
    borderRadius: "20px",
    fontWeight: "bold",
    display: "inline-block",
  },

  searchBar: {
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    fontSize: "16px",
    minWidth: "250px",
  },

  addButton: {
    padding: "10px 15px",
    borderRadius: "20px",
    background: "#1b5e20",
    color: "white",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.2s ease-in-out",
  },

  addButtonHover: {
    background: "#e68900",
  },
  tableContainer: {
    background: "#ffffff",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    marginTop: "10px",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    padding: "10px",
    background: "#e8f5e9",
    borderRadius: "5px",
  },
  columnHeader: { cursor: "pointer", color: "#2e7d32" },
  patientRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    marginTop: "5px",
    textDecoration: "none",
    color: "black",
    background: "#c8e6c9",
    borderRadius: "5px",
  },
  highlight: { fontWeight: "bold", color: "#1b5e20" },
};

export default HomePage;
