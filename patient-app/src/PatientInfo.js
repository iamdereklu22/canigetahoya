import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Firestore instance

const PatientInfo = () => {
  const [patientData, setPatientData] = useState(null);

  // Fetch patient information from Firestore
  const fetchPatientInfo = async () => {
    try {
      const docRef = doc(db, "patient_info", "1"); // Collection: patient_info, Document ID: 1
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPatientData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  useEffect(() => {
    fetchPatientInfo();
  }, []);

  return (
    <div>
      <h1>Patient Info</h1>
      {patientData ? (
        <div>
          <h2>Notes:</h2>
          <p>Author: {patientData.notes.author}</p>
          <p>Location: {patientData.notes.location}</p>
          <p>Text: {patientData.notes.text}</p>
          <p>Time: {patientData.notes.time}</p>

          <h2>Patient Information:</h2>
          <p><strong>First Name:</strong> {patientData.firstName || "N/A"}</p>
          <p><strong>Last Name:</strong> {patientData.lastName || "N/A"}</p>
          <p><strong>Date of Birth:</strong> {patientData.dob || "N/A"}</p>
          <p><strong>Sex:</strong> {patientData.sex || "N/A"}</p>
          <p><strong>Email:</strong> {patientData.email || "N/A"}</p>
          <p><strong>Phone:</strong> {patientData.phone || "N/A"}</p>
          <p><strong>Address:</strong> {patientData.address || "N/A"}</p>
          <p><strong>Allergies:</strong> {patientData.allergies || "N/A"}</p>
          <p><strong>Medications:</strong> {patientData.medications || "N/A"}</p>
          <p><strong>Height:</strong> {patientData.height || "N/A"}</p>
          <p><strong>Weight:</strong> {patientData.weight || "N/A"}</p>
          <p><strong>First Visit:</strong> {patientData.firstVisit || "N/A"}</p>
          <p><strong>Last Visit:</strong> {patientData.lastVisit || "N/A"}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientInfo;