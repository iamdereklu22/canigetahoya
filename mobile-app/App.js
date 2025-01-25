import { useState, useEffect } from 'react';
import { Animated, TouchableOpacity, View, StyleSheet, Button, Alert, TextInput, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [recording, setRecording] = useState();
  const [isPaused, setIsPaused] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setLocation(currentLocation);
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Location Error', 'Could not get current location');
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
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); /* @end */

      console.log('Starting recording..');
      /* @info */ const { recording } = await Audio.Recording.createAsync(
        /* @end */ Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsPaused(false);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function pauseRecording() {
    try {
      if (recording) {
        if (isPaused) {
          await recording.startAsync(); // Resume recording
          setIsPaused(false);
          console.log('Recording resumed');
        } else {
          await recording.pauseAsync(); // Pause recording
          setIsPaused(true);
          console.log('Recording paused');
        }
      }
    } catch (err) {
      console.error('Failed to pause/resume recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    setIsPaused(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    const date = new Date();
    const timestamp = date.toLocaleString('en-US', { 
      timeZone: 'America/New_York' 
    });
    console.log(firstName, lastName, 'saved to:', uri, "at", timestamp, "in", location);
  }

  async function resetRecording() {
    console.log('Resetting recording..');
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    }
    setRecording(undefined);
    setIsPaused(false);
    console.log('Recording reset');
  }

  return (
    <View style={styles.container}>
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
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={recording ? pauseRecording : startRecording}
          disabled={!firstName || !lastName}
        >
          <MaterialIcons 
            name={recording ? (isPaused ? "play-arrow" : "pause") : "play-arrow"} 
            size={32} 
            color={(!firstName || !lastName) ? "#ccc" : "#007AFF"}
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
      <RecordingAnimation 
        isRecording={!!recording} isPaused={isPaused} 
      />
      {(!firstName || !lastName) && (
        <Text style={styles.errorText}>Please enter your first and last name</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'fff',
    padding: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
  buttonWrapper: {
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    gap: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 40,
    textAlign: 'center',
    width: '100%',
    letterSpacing: 1,
  },
  animationContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 30,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
