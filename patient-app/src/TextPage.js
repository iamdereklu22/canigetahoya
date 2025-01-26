import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./TextPage.css"; // ✅ Now fully scoped!

const TextPage = () => {
  const { id, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [text, setText] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        console.log("Fetching note for noteId:", noteId);

        const audioRef = doc(db, "audio_info", noteId);
        const audioSnap = await getDoc(audioRef);

        if (!audioSnap.exists()) {
          console.error("❌ Audio metadata not found.");
          return;
        }

        const audioData = audioSnap.data();
        const textId = audioData.text_id?.toString();

        console.log("Retrieved text_id:", textId);

        if (!textId) {
          console.error("❌ Missing text_id in audio metadata.");
          return;
        }

        // Fetch the corresponding summary text
        const textRef = doc(db, "summary_txt", textId);
        const textSnap = await getDoc(textRef);

        // Fetch doctor info
        const doctorRef = doc(db, "doctor_info", textId);
        const doctorSnap = await getDoc(doctorRef);

        setNote({
          text: textSnap.exists() ? textSnap.data().text : "",
          doctorNotes: doctorSnap.exists() ? doctorSnap.data().notes : "",
          time: audioData.timestamp?.toDate().toLocaleString() || "Unknown",
          author: `${audioData.firstName} ${audioData.lastName}` || "Unknown",
          location: audioData.location || "Unknown",
        });

        setText(textSnap.exists() ? textSnap.data().text : "");
        setDoctorNotes(doctorSnap.exists() ? doctorSnap.data().notes : "");
      } catch (error) {
        console.error("❌ Error fetching note:", error);
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

      const doctorRef = doc(db, "doctor_info", noteId);
      await setDoc(doctorRef, { notes: doctorNotes }, { merge: true });

      navigate(`/patient/${id}`);
    } catch (error) {
      console.error("❌ Error updating text:", error);
    }
  };

  const handleExport = () => {
    // Retrieve doctor notes as a string
    const notesToExport = doctorNotes.trim();

    if (!notesToExport) {
      alert("Doctor notes are empty! Nothing to export.");
      return;
    }

    // Placeholder for export functionality
    console.log("Exporting Doctor Notes:", notesToExport);

    // Later, your friend's function can be called here:
    // exportFunction(notesToExport);
  };

  if (!note) {
    return (
      <div className="text-container">
        <Link to={`/patient/${id}`} className="text-backButton">
          ← Back
        </Link>
        <h2 className="text-pageTitle">Text Not Found</h2>
        <p className="text-infoMessage">The requested note does not exist.</p>
      </div>
    );
  }

  return (
    <div className="text-container">
      {/* Header */}
      <header className="text-header">
        <Link to={`/patient/${id}`} className="text-backButton">
          ← Back
        </Link>
        <h2 className="text-pageTitle">Edit Note</h2>
        <div className="text-userIcon">{note.author}</div>
      </header>

      {/* Metadata Section */}
      <div className="text-infoContainer">
        <p>
          🕒 <strong>Time:</strong> {note.time}
        </p>
        <p>
          📍 <strong>Location:</strong> {note.location}
        </p>
      </div>

      {/* Editable Text Area */}
      <h3>Summary</h3>
      <textarea
        className="text-summaryTextArea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write summary here..."
      ></textarea>

      {/* Doctor Notes Section */}
      <h3>Doctor Notes</h3>
      <textarea
        className="text-doctorNotesArea"
        value={doctorNotes}
        onChange={(e) => setDoctorNotes(e.target.value)}
        placeholder="Write doctor notes here..."
      ></textarea>

      {/* Save & Export Buttons */}
      <div className="text-buttonContainer">
        <button className="text-saveButton" onClick={handleSave}>
          💾 Save
        </button>
        <button className="text-exportButton" onClick={handleExport}>
          📤 Export
        </button>
      </div>
    </div>
  );
};

export default TextPage;
