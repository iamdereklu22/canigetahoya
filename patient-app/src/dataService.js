import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  getDocs,
  Timestamp,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { localToUTC } from "./timeUtils";

export const addNewPatient = async () => {
  try {
    const patientsRef = collection(db, "patient_info");
    const snapshot = await getDocs(patientsRef);

    let nextId =
      snapshot.docs.length > 0
        ? Math.max(...snapshot.docs.map((doc) => parseInt(doc.id))) + 1
        : 1;

    const currentTime = Timestamp.now(); // Firestore timestamp

    //convert utc
    const localTime = localToUTC(currentTime.seconds * 1000);

    const newPatient = {
      firstName: "Patient",
      lastName: "1",
      sex: "",
      dob: "",
      firstVisit: localTime,
      lastVisit: localTime,
      address: "",
      phone: "",
      email: "",
      allergies: "",
      medications: "",
      height: "",
      weight: "",
    };

    await setDoc(doc(db, "patient_info", nextId.toString()), newPatient);
    console.log(`New patient added with ID: ${nextId}`);

    return nextId;
  } catch (error) {
    console.error("Error adding new patient:", error);
    return null;
  }
};

// Fetch patients in real-time
export const getPatients = (setPatients) => {
  const patientsRef = collection(db, "patient_info");

  return onSnapshot(
    patientsRef,
    (snapshot) => {
      const patientsData = {};
      snapshot.forEach((doc) => {
        patientsData[doc.id] = { id: doc.id, ...doc.data() };
      });
      setPatients(patientsData);
    },
    (error) => {
      console.error("Error fetching real-time patients:", error);
    }
  );
};

export const updatePatient = async (patientId, updatedData) => {
  try {
    const patientRef = doc(db, "patient_info", patientId);

    if (updatedData.firstVisit) {
      updatedData.firstVisit = Timestamp.fromDate(
        localToUTC(updatedData.firstVisit.seconds * 1000)
      );
    }
    if (updatedData.lastVisit) {
      updatedData.lastVisit = Timestamp.fromDate(
        localToUTC(updatedData.lastVisit.seconds * 1000)
      );
    }

    await setDoc(patientRef, updatedData, { merge: true });

    console.log(`Updated patient ${patientId} successfully.`);
  } catch (error) {
    console.error("Error updating patient:", error);
  }
};

// =============================================================================

const initialNotes = {
  1: {
    t1: {
      time: "2:00PM",
      author: "Dr. Smith",
      location: "ABC Hospital",
      text: "Initial notes for John Doe.",
    },
    t2: {
      time: "1:00PM",
      author: "Dr. Smith",
      location: "ABC Hospital",
      text: "Follow-up notes for John Doe.",
    },
  },
  2: {
    t3: {
      time: "2:00PM",
      author: "Dr. Adams",
      location: "XYZ Clinic",
      text: "Jane Smith recovery notes.",
    },
  },
  3: {
    t4: {
      time: "1:00PM",
      author: "Dr. Patel",
      location: "High Street Medical",
      text: "Emily's check-up.",
    },
  },
};

export const getNotes = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(initialNotes), 500);
  });
};

// Function to update a note (in local state)
export const updateNote = (patients, setNotes, patientId, noteId, newText) => {
  setNotes((prev) => ({
    ...prev,
    [patientId]: {
      ...prev[patientId],
      [noteId]: { ...prev[patientId][noteId], text: newText },
    },
  }));
};

export const getPatientNotes = async (firstName) => {
  try {
    // Query Firestore to get all notes where firstName matches
    const audioQuery = query(
      collection(db, "audio_info"),
      where("firstName", "==", firstName)
    );
    const audioSnapshot = await getDocs(audioQuery);

    let notes = {};

    for (const audioDoc of audioSnapshot.docs) {
      const audioData = audioDoc.data();
      const textId = audioDoc.id;

      // Fetch corresponding summary_txt using textId
      const textRef = doc(db, "summary_txt", textId);
      const textSnap = await getDoc(textRef);

      if (textSnap.exists()) {
        notes[textId] = {
          time: audioData.timestamp.toDate().toLocaleString(),
          author: `${audioData.firstName} ${audioData.lastName}`,
          location: audioData.location,
          text: textSnap.data().text,
        };
      }
    }

    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return {};
  }
};
