import { useState, useEffect, useRef } from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  TextInput,
  Text,
  Platform,
  SafeAreaView,
} from "react-native";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, addDoc, doc, runTransaction, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { storage } from "./firebaseConfig"; // Import from firebaseConfig
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function App() {
  const [recording, setRecording] = useState();
  const [isPaused, setIsPaused] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required");
        return;
      }
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Location Error", "Could not get current location");
      }
    })();
  }, []);

  const RecordingAnimation = ({ isRecording, isPaused }) => {
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
      if (isRecording && !isPaused) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        pulseAnim.setValue(1);
      }
    }, [isRecording, isPaused]);

    return (
      <Animated.View
        style={[
          styles.animationContainer,
          {
            transform: [{ scale: pulseAnim }],
            opacity: isRecording ? 1 : 0,
          },
        ]}
      >
        <MaterialIcons
          name="mic"
          size={50}
          color={isPaused ? "#666" : "#ff0000"}
        />
      </Animated.View>
    );
  };

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); /* @end */

      console.log("Starting recording..");
      /* @info */ const { recording } = await Audio.Recording.createAsync(
        /* @end */ Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsPaused(false);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function pauseRecording() {
    try {
      if (!recording) {
        console.log("No active recording to pause");
        return;
      }

      if (isPaused) {
        await recording.startAsync(); // Resume recording
        setIsPaused(false);
        console.log("Recording resumed");
      } else {
        await recording.pauseAsync(); // Pause recording
        setIsPaused(true);
        console.log("Recording paused");
      }
    } catch (err) {
      console.error("Failed to pause/resume recording", err);
    }
  }

  async function getNextId() {
    const counterRef = doc(db, "counters", "recordingCounter");

    try {
      const result = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const newCount =
          (counterDoc.exists() ? counterDoc.data().value : 0) + 1;

        transaction.set(counterRef, { value: newCount }, { merge: true });
        return newCount;
      });

      return result;
    } catch (error) {
      console.error("Error getting next ID:", error);
      throw error;
    }
  }

  async function uploadAudioToStorage(uri, fileName) {
    const response = await fetch(uri);
    const blob = await response.blob(); // Convert to Blob
    const storageRef = ref(storage, `audio_files_recording/${fileName}`); // ✅ Use imported storage

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File uploaded successfully:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }
  }

  async function stopRecording() {
    try {
      if (!recording) {
        console.log("No active recording to stop");
        return;
      }

      console.log("Stopping recording..");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);
      setIsPaused(false);
      setShowPrompt(true);

      const latitude = location?.coords?.latitude || "Unknown";
      const longitude = location?.coords?.longitude || "Unknown";
      const locationString = `${latitude}, ${longitude}`;

      // Fetch and increment the text_id counter
      const nextId = await getNextId();

      // Generate a filename for storage
      const fileName = `recording_${nextId}.m4a`;

      // Upload to Firebase Storage
      const audioURL = await uploadAudioToStorage(uri, fileName);

      // ✅ Store Firestore Timestamp
      const timestamp = Timestamp.fromDate(new Date());

      // Create structured data
      const audioInfo = {
        firstName: firstName,
        lastName: lastName,
        location: locationString,
        text_id: nextId, // Incremental counter
        timestamp: timestamp, // ✅ Now stored as Firebase Timestamp
        audioFile: audioURL, // Store Storage URL
      };

      // Save to Firestore in the "audio_info" collection
      await addDoc(collection(db, "audio_info"), audioInfo);

      setShowNotification(true);
      setNotificationMessage(
        `Recording for ${firstName} ${lastName} has been uploaded.`
      );

      console.log(
        "Recording metadata saved to Firestore with correct timestamp"
      );
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      setShowNotification(true);
      setNotificationMessage("Failed to save recording. Please try again.");
    }
  }

  const CustomNotification = ({ visible, message, onDismiss }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (visible) {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(3000), // Show for 3 seconds
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onDismiss());
      }
    }, [visible]);

    if (!visible) return null;

    return (
      <TouchableWithoutFeedback onPress={onDismiss}>
        <Animated.View
          style={[
            styles.notification,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.notificationText}>{message}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  async function resetRecording() {
    console.log("Resetting recording..");
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    }
    setRecording(undefined);
    setIsPaused(false);
    console.log("Recording reset");
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <MaterialIcons
          name="local-hospital"
          size={100}
          color="#007AFF"
          style={styles.backgroundPattern}
        />
        <MaterialIcons
          name="healing"
          size={100}
          color="#007AFF"
          style={styles.backgroundPatternBottom}
        />
        <Text style={styles.appTitle}>DocuMed</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        {(!firstName || !lastName) && (
          <Text style={styles.errorText}>
            Please enter your first and last name
          </Text>
        )}
        <View style={styles.controlsContainer}>
          {firstName && lastName && showPrompt && !recording && (
            <Text style={styles.recordPrompt}>Press to start recording!</Text>
          )}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setShowPrompt(false);
              recording ? pauseRecording() : startRecording();
            }}
            disabled={!firstName || !lastName}
          >
            <MaterialIcons
              name={
                recording ? (isPaused ? "play-arrow" : "pause") : "play-arrow"
              }
              size={32}
              color={!firstName || !lastName ? "#ccc" : "#007AFF"}
            />
          </TouchableOpacity>
          {recording && (
            <>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={stopRecording}
              >
                <MaterialIcons name="stop" size={32} color="#007AFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  resetRecording();
                }}
              >
                <MaterialIcons name="refresh" size={32} color="#007AFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
        <RecordingAnimation isRecording={!!recording} isPaused={isPaused} />
        <CustomNotification
          visible={showNotification}
          message={notificationMessage}
          onDismiss={() => setShowNotification(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 150 : 90,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  backgroundPattern: {
    position: "absolute",
    top: 40,
    right: 30,
    opacity: 0.1,
  },
  backgroundPatternTop: {
    position: "absolute",
    top: Platform.OS === "ios" ? 80 : 60,
    right: 30,
    opacity: 0.1,
  },
  backgroundPatternBottom: {
    position: "absolute",
    bottom: 40,
    left: 30,
    opacity: 0.1,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 40,
    textAlign: "center",
    width: "100%",
    letterSpacing: 2,
  },
  animationContainer: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 30,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  notification: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    fontSize: 16,
  },
  recordPrompt: {
    position: "absolute",
    bottom: -40,
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
