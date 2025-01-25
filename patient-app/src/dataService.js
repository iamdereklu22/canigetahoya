// src/dataService.js
const initialPatients = {
    1: { 
      lastName: "Doe", 
      firstName: "John", 
      sex: "M", 
      dob: "1990-07-07", 
      firstVisit: "2020-06-10",
      lastVisit: "2025-01-22",
      address: "123 Main St, New York, NY",
      phone: "555-1234",
      email: "john.doe@example.com",
      allergies: "Peanuts", 
      medications: "Ibuprofen", 
      height: "6ft", 
      weight: "180 lbs" 
    },
    2: { 
      lastName: "Smith", 
      firstName: "Jane", 
      sex: "F", 
      dob: "1985-07-07", 
      firstVisit: "2018-03-15",
      lastVisit: "2025-01-23",
      address: "456 Oak Ave, Los Angeles, CA",
      phone: "555-5678",
      email: "jane.smith@example.com",
      allergies: "None", 
      medications: "Aspirin", 
      height: "5'7", 
      weight: "150 lbs" 
    },
    3: { 
      lastName: "Johnson", 
      firstName: "Emily", 
      sex: "F", 
      dob: "2000-07-07", 
      firstVisit: "2023-09-30",
      lastVisit: "2025-01-03",
      address: "789 Pine St, Chicago, IL",
      phone: "555-7890",
      email: "emily.johnson@example.com",
      allergies: "Shellfish", 
      medications: "None", 
      height: "5'4", 
      weight: "130 lbs" 
    }
  };
  
  const initialNotes = {
    1: { 
      t1: { time: "2:00PM", author: "Dr. Smith", location: "ABC Hospital", text: "Initial notes for John Doe." },
      t2: { time: "1:00PM", author: "Dr. Smith", location: "ABC Hospital", text: "Follow-up notes for John Doe." }
    },
    2: { 
      t3: { time: "2:00PM", author: "Dr. Adams", location: "XYZ Clinic", text: "Jane Smith recovery notes." }
    },
    3: { 
      t4: { time: "1:00PM", author: "Dr. Patel", location: "High Street Medical", text: "Emily's check-up." }
    }
  };
  
  // Simulate fetching data (later replace with Firebase calls)
  export const getPatients = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialPatients), 500); // Simulate network delay
    });
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
        [noteId]: { ...prev[patientId][noteId], text: newText } 
      }
    }));
  };