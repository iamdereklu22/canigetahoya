export const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
  
    let date;
    if (typeof timestamp === "object" && timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp to JavaScript Date
    } else if (typeof timestamp === "string" || typeof timestamp === "number") {
      date = new Date(timestamp); // Handle ISO strings or timestamps
    } else {
      return "Invalid Date";
    }
  
    // Convert UTC time to Eastern Time (EST/EDT)
    const options = {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
  
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

export const formatStore = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return new Date(date.getTime());
};

export const formatDisplay = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";
    const date = new Date(timestamp.seconds * 1000);
    return new Date(date.getTime()).toISOString().slice(0, 16);;
};

// Convert local time to UTC for Firestore storage
export const localToUTC = (localTime) => {
    if (!localTime) return null;
    const date = new Date(localTime);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

// Convert UTC Firestore Timestamp to local time for display
export const utcToLocal = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";
    const date = new Date(timestamp.seconds * 1000);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export const utcToLocalDisplay = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    const ndate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    const options = {
        year: "numeric",
        month: "short", // "Jan" instead of "01"
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // 12-hour format
    };

    return new Intl.DateTimeFormat("en-US", options).format(ndate);
};