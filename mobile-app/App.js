import { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      /* @info */ if (permissionResponse.status !== 'granted') {
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
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    /* @info */ await recording.stopAndUnloadAsync(); /* @end */
    /* @info iOS may reroute audio playback to the phone earpiece when recording is allowed, so disable once finished. */ await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    ); /* @end */
    /* @info */ const uri = recording.getURI(); /* @end */
    console.log('Recording stopped and stored at', uri);
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
