import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./TextPage.css"; // ✅ Keeping styles consistent

const TextPage = () => {
  const { id, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const audioRef = doc(db, "audio_info", noteId);
        const audioSnap = await getDoc(audioRef);

        const textRef = doc(db, "summary_txt", noteId);
        const textSnap = await getDoc(textRef);

        if (textSnap.exists() && audioSnap.exists()) {
          setNote({
            text: textSnap.data().text || "",
            time: audioSnap.data().timestamp?.toDate().toLocaleString() || "Unknown",
            author: `${audioSnap.data().firstName} ${audioSnap.data().lastName}` || "Unknown",
            location: audioSnap.data().location || "Unknown",
          });
          setText(textSnap.data().text || "");
        } else {
          console.error("Note metadata or text not found.");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleSave = async () => {
    if (text.trim() === "") {
      alert("Text cannot be empty!");
      return;
    }

    try {
      const textRef = doc(db, "summary_txt", noteId);
      await setDoc(textRef, { text }, { merge: true });

      // alert("Text updated successfully!");
      navigate(`/patient/${id}`);
    } catch (error) {
      console.error("Error updating text:", error);
    }
  };

  if (!note) {
    return (
      <div className="container">
        <Link to={`/patient/${id}`} className="backButton">← Back</Link>
        <h2 className="pageTitle">Text Not Found</h2>
        <p className="infoMessage">The requested note does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <Link to={`/patient/${id}`} className="backButton">← Back</Link>
        </div>
        <h2 className="pageTitle">Edit Note</h2>
        <div className="header-right">
          <span className="userIcon">👤 Derek Lu</span>
        </div>
      </header>

      {/* Metadata Section */}
      <div className="infoContainer">
        <p><strong>🕒 Time:</strong> {note.time}</p>
        <p><strong>👤 Author:</strong> {note.author}</p>
        <p><strong>📍 Location:</strong> {note.location}</p>
      </div>

      {/* Editable Text Area */}
      <textarea
        className="textArea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Edit text here..."
      ></textarea>

      {/* Save Button */}
      <button className="saveButton" onClick={handleSave}>💾 Save</button>
    </div>
  );
};

export default TextPage;