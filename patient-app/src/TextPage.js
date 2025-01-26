import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./TextPage.css"; // ✅ Now fully scoped!
import { jsPDF } from "jspdf";

function generatePatientReport_JohnKim() {
  const doc = new jsPDF();

  // Add Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Patient Medical Analysis Report", 105, 10, { align: "center" });

  // Add Patient Information Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 10, 20);
  doc.setFont("helvetica", "normal");
  doc.line(10, 22, 200, 22);

  doc.text("Name: John Kim", 10, 30);
  doc.text("Date of Birth: February 14, 1995", 10, 35);
  doc.text("Age: 29 years", 10, 40);
  doc.text("Sex: Male", 10, 45);
  doc.text("Height: 5'9\"", 10, 50);
  doc.text("Weight: 160 lbs", 10, 55);
  doc.text("Address: 42 Elm Street, New York, NY", 10, 60);
  doc.text("Primary Contact: 917-555-6789", 10, 65);

  // Add Chief Complaint Section
  doc.setFont("helvetica", "bold");
  doc.text("Chief Complaint", 10, 75);
  doc.setFont("helvetica", "normal");
  doc.line(10, 77, 200, 77);
  doc.text(
    "Primary Concern: Persistent abdominal discomfort, nausea, and unintentional weight loss over the past 2 months.",
    10,
    85
  );
  doc.text("Duration: 2 months", 10, 90);
  doc.text(
    "Associated Symptoms: Diarrhea, fatigue, occasional vomiting, and appetite changes.",
    10,
    95
  );

  // Add Current Medications Section
  doc.setFont("helvetica", "bold");
  doc.text("Current Medications", 10, 105);
  doc.setFont("helvetica", "normal");
  doc.line(10, 107, 200, 107);
  doc.text(
    "1. Multivitamin: Taken daily to address nutritional deficiencies.",
    10,
    115
  );
  doc.text(
    "2. Probiotic Supplement: Taken daily to support gut health.",
    10,
    120
  );

  // Add Tests Performed Section
  doc.setFont("helvetica", "bold");
  doc.text("Tests Performed", 10, 130);
  doc.setFont("helvetica", "normal");
  doc.line(10, 132, 200, 132);
  doc.text("1. Stool Sample Analysis:", 10, 140);
  doc.text("   - Presence of tapeworm eggs and segments detected.", 10, 145);
  doc.text("2. Blood Tests:", 10, 155);
  doc.text(
    "   - Elevated eosinophil count, indicating parasitic infection.",
    10,
    160
  );
  doc.text("3. Imaging:", 10, 170);
  doc.text(
    "   - Abdominal ultrasound revealed possible cysts in the liver, suggestive of larval migration.",
    10,
    175
  );

  // Add Treatment Plan Section
  doc.setFont("helvetica", "bold");
  doc.text("Treatment Plan", 10, 185);
  doc.setFont("helvetica", "normal");
  doc.line(10, 187, 200, 187);
  doc.text("1. Immediate Interventions:", 10, 195);
  doc.text(
    "   - Prescription of praziquantel (600 mg) to treat the tapeworm infection.",
    10,
    200
  );
  doc.text(
    "   - Antiemetics (e.g., ondansetron) as needed for nausea control.",
    10,
    205
  );
  doc.text("2. Dietary Recommendations:", 10, 215);
  doc.text(
    "   - High-fiber diet to support digestive health during treatment.",
    10,
    220
  );
  doc.text(
    "   - Adequate hydration to reduce side effects of medication.",
    10,
    225
  );
  doc.text("3. Follow-Up Care:", 10, 235);
  doc.text(
    "   - Stool sample retesting in 1 month to confirm eradication of the parasite.",
    10,
    240
  );
  doc.text(
    "   - Regular monitoring for complications such as cysticercosis or nutritional deficiencies.",
    10,
    245
  );

  // Add Doctor's Notes Section
  doc.setFont("helvetica", "bold");
  doc.text("Doctor's Notes", 10, 255);
  doc.setFont("helvetica", "normal");
  doc.line(10, 257, 200, 257);
  doc.text(
    "Patient's symptoms and test results strongly suggest a tapeworm infection. " +
      "Praziquantel has been prescribed as the first-line treatment. Patient is advised to maintain " +
      "a high-fiber diet and stay hydrated to manage medication effects. Stool sample retesting in 4 weeks " +
      "is necessary to ensure the parasite has been fully eradicated. Patient and family have been counseled on the importance " +
      "of proper hygiene and cooking practices to prevent reinfection.",
    10,
    265,
    { maxWidth: 190 } // Wrap text within page width
  );

  // Save the PDF
  doc.save("John_Kim_Medical_Report.pdf");
}

function generatePatientReport_DerekLu() {
  const doc = new jsPDF();

  // Add Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Patient Medical Analysis Report", 105, 10, { align: "center" });

  // Add Patient Information Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 10, 20);
  doc.line(10, 22, 200, 22);

  doc.text("Name: Derek Lu", 10, 30);
  doc.text("Date of Birth: October 25, 2004", 10, 35);
  doc.text("Age: 20 years", 10, 40);
  doc.text("Sex: Male", 10, 45);
  doc.text("Height: 5'6\"", 10, 50);
  doc.text("Weight: 135 lbs", 10, 55);
  doc.text("Address: 26 Sargent Place", 10, 60);
  doc.text("Primary Contact: 516-587-1039", 10, 65);

  // Add Chief Complaint Section
  doc.setFont("helvetica", "bold");
  doc.text("Chief Complaint", 10, 75);
  doc.setFont("helvetica", "normal");
  doc.line(10, 77, 200, 77);
  doc.text(
    "Primary Concern: Severe abdominal pain located in the lower right quadrant, worsening over 24 hours.",
    10,
    85
  );
  doc.text("Duration: 24 hours", 10, 90);
  doc.text(
    "Associated Symptoms: Nausea, fever, loss of appetite, and rebound tenderness.",
    10,
    95
  );

  // Add Current Medications Section
  doc.setFont("helvetica", "bold");
  doc.text("Current Medications", 10, 105);
  doc.setFont("helvetica", "normal");
  doc.line(10, 107, 200, 107);
  doc.text(
    "1. Acetaminophen 500 mg: Taken as needed for fever and pain relief.",
    10,
    115
  );
  doc.text("2. Ondansetron 4 mg: Prescribed for nausea management.", 10, 120);
  doc.text(
    "3. Probiotic Supplement: Taken daily to support gut health.",
    10,
    125
  );

  // Add Tests Performed Section
  doc.setFont("helvetica", "bold");
  doc.text("Tests Performed", 10, 135);
  doc.setFont("helvetica", "normal");
  doc.line(10, 137, 200, 137);
  doc.text("1. Physical Examination:", 10, 145);
  doc.text(
    "   - Positive McBurney's point tenderness and signs of peritoneal irritation.",
    10,
    150
  );
  doc.text("2. Blood Tests:", 10, 160);
  doc.text(
    "   - Elevated white blood cell count (15,000/mcL), indicative of acute inflammation.",
    10,
    165
  );
  doc.text("   - Elevated CRP levels, confirming systemic infection.", 10, 170);
  doc.text("3. Imaging:", 10, 180);
  doc.text(
    "   - Abdominal ultrasound revealed an inflamed appendix with a diameter of 8 mm.",
    10,
    185
  );
  doc.text(
    "   - CT scan of the abdomen confirmed appendiceal thickening and inflammation.",
    10,
    190
  );

  // Add Treatment Plan Section
  doc.setFont("helvetica", "bold");
  doc.text("Treatment Plan", 10, 200);
  doc.setFont("helvetica", "normal");
  doc.line(10, 202, 200, 202);
  doc.text("1. Immediate Interventions:", 10, 210);
  doc.text(
    "   - Emergency appendectomy under general anesthesia to remove the inflamed appendix.",
    10,
    215
  );
  doc.text(
    "   - Intravenous antibiotics (e.g., ceftriaxone) pre-operatively to prevent septic complications.",
    10,
    220
  );
  doc.text("2. Post-Surgery Care:", 10, 230);
  doc.text(
    "   - Pain management with acetaminophen or ibuprofen as needed.",
    10,
    235
  );
  doc.text(
    "   - Encouragement of early ambulation to promote recovery and prevent complications.",
    10,
    240
  );
  doc.text(
    "   - Prescribe a short course of oral antibiotics post-operatively.",
    10,
    245
  );
  doc.text(
    "   - Follow-up appointment in 1 week to assess recovery progress and ensure no signs of infection.",
    10,
    250
  );

  // Add Doctor's Notes Section
  doc.setFont("helvetica", "bold");
  doc.text("Doctor's Notes", 10, 260);
  doc.setFont("helvetica", "normal");
  doc.line(10, 262, 200, 262);
  doc.text(
    "Patient presented with classic symptoms of acute appendicitis. " +
      "Physical examination and imaging confirmed diagnosis. Immediate surgery is recommended to prevent rupture, " +
      "which could lead to peritonitis. Post-surgery, monitor for signs of infection or complications such as " +
      "intestinal obstruction or abscess formation. Advised dietary modifications and increased hydration to aid recovery. " +
      "Patient and family have been informed about the procedure, associated risks, and expected outcomes.",
    10,
    270,
    { maxWidth: 190 } // Wrap text within page width
  );

  // Save the PDF
  doc.save("Derek_Lu_Medical_Report.pdf");
}

function generatePatientReport_GeorgeWashington(doctors_notes) {
  const doc = new jsPDF();

  // Add Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Patient Medical Analysis Report", 105, 10, { align: "center" });

  // Add Patient Information Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 10, 20);
  doc.setFont("helvetica", "normal");
  doc.line(10, 22, 200, 22);

  doc.text("Name: George Washington", 10, 30);
  doc.text("Date of Birth: February 22, 1732", 10, 35);
  doc.text("Age: 293 years", 10, 40);
  doc.text("Sex: Male", 10, 45);
  doc.text("Height: 6'2\"", 10, 50);
  doc.text("Weight: 175 lbs", 10, 55);
  doc.text("Address: 3200 Mount Vernon Memorial Hwy, Mount Vernon, VA", 10, 60);
  doc.text("Primary Contact: 555-1776-1789", 10, 65);

  // Add Chief Complaint Section
  doc.setFont("helvetica", "bold");
  doc.text("Chief Complaint", 10, 75);
  doc.setFont("helvetica", "normal");
  doc.line(10, 77, 200, 77);
  doc.text(
    "Primary Concern: Persistent difficulty falling asleep and frequent nighttime awakenings over the past 6 months.",
    10,
    85
  );
  doc.text("Duration: 6 months", 10, 90);
  doc.text(
    "Associated Symptoms: Daytime fatigue, irritability, reduced concentration, and mild headaches.",
    10,
    95
  );

  // Add Current Medications Section
  doc.setFont("helvetica", "bold");
  doc.text("Current Medications", 10, 105);
  doc.setFont("helvetica", "normal");
  doc.line(10, 107, 200, 107);
  doc.text("1. Melatonin 3 mg: Taken nightly to promote sleep.", 10, 115);
  doc.text(
    "2. Magnesium Glycinate: Taken to support relaxation and reduce muscle tension.",
    10,
    120
  );
  doc.text("3. Multivitamin: Taken daily for general health support.", 10, 125);

  // Add Tests Performed Section
  doc.setFont("helvetica", "bold");
  doc.text("Tests Performed", 10, 135);
  doc.setFont("helvetica", "normal");
  doc.line(10, 137, 200, 137);
  doc.text("1. Sleep Diary Review:", 10, 145);
  doc.text(
    "   - Patient logs show average sleep duration of 4-5 hours per night with frequent awakenings.",
    10,
    150
  );
  doc.text("2. Polysomnography (Sleep Study):", 10, 160);
  doc.text(
    "   - Findings include prolonged sleep latency and reduced REM sleep stages, consistent with insomnia.",
    10,
    165
  );
  doc.text("3. Blood Work:", 10, 175);
  doc.text(
    "   - Normal thyroid function tests and no significant vitamin deficiencies detected.",
    10,
    180
  );

  // Add Treatment Plan Section
  doc.setFont("helvetica", "bold");
  doc.text("Treatment Plan", 10, 190);
  doc.setFont("helvetica", "normal");
  doc.line(10, 192, 200, 192);
  doc.text("1. Lifestyle Modifications:", 10, 200);
  doc.text(
    "   - Establish a consistent sleep schedule by maintaining fixed bed and wake times.",
    10,
    205
  );
  doc.text(
    "   - Limit screen time and caffeine intake in the evenings.",
    10,
    210
  );
  doc.text(
    "   - Engage in relaxation techniques such as meditation or progressive muscle relaxation.",
    10,
    215
  );
  doc.text("2. Behavioral Therapy:", 10, 225);
  doc.text(
    "   - Initiate cognitive-behavioral therapy for insomnia (CBT-I) to address sleep patterns and habits.",
    10,
    230
  );
  doc.text("3. Medications (Short-Term):", 10, 240);
  doc.text(
    "   - Prescribed zolpidem 5 mg as needed for short-term management of sleep initiation difficulties.",
    10,
    245
  );

  // Add Doctor's Notes Section
  doc.setFont("helvetica", "bold");
  doc.text("Doctor's Notes", 10, 255);
  doc.setFont("helvetica", "normal");
  doc.line(10, 257, 200, 257);
  doc.text(
    doctors_notes,
    10,
    265,
    { maxWidth: 190 } // Wrap text within page width
  );

  // Save the PDF
  doc.save("George_Washington_Medical_Report.pdf");
}


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
    const notesToExport = doctorNotes.trim();
  
    if (!notesToExport) {
      alert("Doctor notes are empty! Nothing to export.");
      return;
    }
  
    console.log("Exporting Doctor Notes for", note.author, ":", notesToExport);
  
    switch (note.author) {
      case "John Kim":
        generatePatientReport_JohnKim(notesToExport);
        break;
      case "Derek Lu":
        generatePatientReport_DerekLu(notesToExport);
        break;
      case "George Washington":
        generatePatientReport_GeorgeWashington(notesToExport);
        break;
      default:
        alert("No export template available for this patient.");
    }
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
