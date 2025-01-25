import React, { useState } from "react";
import { Link } from "react-router-dom";

const HomePage = ({ patients }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedPatients = Object.keys(patients)
    .filter((id) =>
      patients[id].firstName.toLowerCase().includes(search.toLowerCase()) ||
      patients[id].lastName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = sortField === "name"
        ? `${patients[a].firstName} ${patients[a].lastName}`
        : patients[a].lastVisit;
      const valB = sortField === "name"
        ? `${patients[b].firstName} ${patients[b].lastName}`
        : patients[b].lastVisit;

      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>WebApp Name</h2>
        <span style={styles.userIcon}>👤 Derek Lu</span>
      </header>

      <input
        type="text"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchBar}
      />

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <span onClick={() => toggleSort("name")} style={styles.columnHeader}>Patient Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
          <span onClick={() => toggleSort("lastVisit")} style={styles.columnHeader}>Last Modified {sortField === "lastVisit" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
        </div>

        {sortedPatients.map((id) => (
          <Link to={`/patient/${id}`} key={id} style={styles.patientRow}>
            <span style={styles.highlight}>{patients[id].firstName} {patients[id].lastName}</span>
            <span>{patients[id].lastVisit}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif", background: "#f4f6f9", height: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  userIcon: { fontSize: "16px", background: "#e0e0e0", padding: "5px 10px", borderRadius: "8px" },
  searchBar: { width: "48%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ccc" },
  tableContainer: { background: "#ffffff", borderRadius: "8px", padding: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" },
  tableHeader: { display: "flex", justifyContent: "space-between", fontWeight: "bold", padding: "10px", background: "#e8f5e9", borderRadius: "5px" },
  columnHeader: { cursor: "pointer", color: "#2e7d32" },
  patientRow: { display: "flex", justifyContent: "space-between", padding: "12px", marginTop: "5px", textDecoration: "none", color: "black", background: "#c8e6c9", borderRadius: "5px" },
  highlight: { fontWeight: "bold", color: "#1b5e20" }
};

export default HomePage;