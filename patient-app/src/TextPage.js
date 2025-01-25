import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const TextPage = ({ notes, updateText }) => {
  const { id, noteId } = useParams();
  const navigate = useNavigate();

  // Get the note safely, avoid undefined errors
  const note = notes?.[id]?.[noteId] || null;

  // Initialize state at the top level
  const [text, setText] = useState(note.text || "");

  // Ensure the text updates if the user switches notes
  useEffect(() => {
    setText(note.text || "");
  }, [note.text]);

  const handleSave = () => {
    if (text.trim() === "") {
      alert("Text cannot be empty!");
      return;
    }
    updateText(id, noteId, text);  // ✅ Use 'noteId' instead of 'textId'
    navigate(`/patient/${id}`);
  };

  // If the note doesn't exist, show an error message
  if (!notes?.[id]?.[noteId]) {
    return (
      <div style={styles.container}>
        <Link to={`/patient/${id}`} style={styles.backButton}>← Back</Link>
        <h2>Text Not Found</h2>
        <p>The requested note does not exist.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to={`/patient/${id}`} style={styles.backButton}>← Back</Link>
        <h2>Text Editor</h2>
      </header>

      <div style={styles.infoBox}>
        <p><strong>Time:</strong> {note.time}</p>
        <p><strong>Author:</strong> {note.author}</p>
        <p><strong>Location:</strong> {note.location}</p>
      </div>

      <textarea 
        style={styles.textArea} 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Edit text here..."
      ></textarea>

      <button style={styles.saveButton} onClick={handleSave}>Save</button>
    </div>
  );
};

// ✅ Updated Styles for Better Layout
const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif", background: "#f4f6f9", height: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  backButton: { textDecoration: "none", fontSize: "16px", color: "blue" },
  infoBox: { background: "#ffffff", padding: "10px", borderRadius: "8px", marginBottom: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" },
  textArea: { width: "100%", height: "200px", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
  saveButton: { padding: "10px", background: "#008CBA", color: "white", border: "none", cursor: "pointer", borderRadius: "5px", marginTop: "10px", width: "100%" }
};

export default TextPage;