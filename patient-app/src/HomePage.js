import React, { useState } from "react";
import { Link } from "react-router-dom";

const mockPatients = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Emily Johnson" },
];

const HomePage = () => {
  const [search, setSearch] = useState("");

  return (
    <div style={styles.container}>
      <h2>Webapp Home Page</h2>
      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchBar}
      />
      <h3>Patients</h3>
      <ul style={styles.list}>
        {mockPatients
          .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          .map((patient) => (
            <li key={patient.id} style={styles.listItem}>
              <Link to={`/patient/${patient.id}`} style={styles.link}>
                {patient.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  searchBar: { padding: "8px", width: "200px", marginBottom: "10px" },
  list: { listStyle: "none", padding: 0 },
  listItem: { padding: "10px", background: "#f0f0f0", margin: "5px 0" },
  link: { textDecoration: "none", color: "black" },
};

export default HomePage;