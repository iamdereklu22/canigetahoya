import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Mock text content for each text entry
const textContent = {
  t1: "Initial notes for John Doe's first visit.",
  t2: "Follow-up notes for John Doe's second visit.",
  t3: "Jane Smith's recovery update.",
  t4: "Annual check-up summary for Emily Johnson.",
  t5: "Extra notes from Dr. Patel for Emily Johnson."
};

const TextPage = () => {
  const { id, textId } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState(textContent[textId] || "");

  const handleSave = () => {
    console.log(`Saved Text for ${textId}:`, text);
    navigate(`/patient/${id}`);
  };

  return (
    <div style={styles.container}>
      <Link to={`/patient/${id}`} style={styles.backButton}>← Back</Link>
      <h2>Text Editor</h2>

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

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  backButton: { textDecoration: "none", fontSize: "16px", marginBottom: "10px", display: "block" },
  textArea: { width: "100%", height: "200px", padding: "10px", fontSize: "16px" },
  saveButton: { padding: "10px", background: "#008CBA", color: "white", border: "none", cursor: "pointer", borderRadius: "5px", marginTop: "10px" }
};

export default TextPage;