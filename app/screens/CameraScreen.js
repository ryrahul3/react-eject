import React, { useState, useEffect } from 'react';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Ionicons } from '@expo/vector-icons';
import { AzureBlobService } from '../shared/azure-blob-service';
import styles from '../config/styles';
import Gallery from '../shared/gallery.component';
import { useIsFocused } from '@react-navigation/native';
const flashModeOrderDepend = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashModeOrder = {
  off: Camera.Constants.FlashMode.off,
  on: Camera.Constants.FlashMode.on,
  auto: Camera.Constants.FlashMode.auto,
  torch: Camera.Constants.FlashMode.torch,
};

const flashIcons = {
  off: 'md-flash-off',
  on: 'md-flash',
  auto: 'ios-infinite',
  torch: 'md-flashlight',
};

const wbOrderDependent = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const wbOrder = {
  auto: Camera.Constants.FlashMode.auto,
  sunny: Camera.Constants.FlashMode.sunny,
  cloudy: Camera.Constants.FlashMode.cloudy,
  shadow: Camera.Constants.FlashMode.shadow,
  fluorescent: Camera.Constants.FlashMode.fluorescent,
  incandescent: Camera.Constants.FlashMode.incandescent,
};

const wbIcons = {
  auto: 'md-color-wand',
  sunny: 'md-sunny',
  cloudy: 'md-cloud-outline',
  shadow: 'md-water',
  fluorescent: 'md-cloud',
  incandescent: 'ios-beer',
};

function CameraScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [recording, setRecording] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const [wb, setWb] = useState('auto');
  const [captures, setCapture] = useState([]);
  const [ratio, setRatio] = useState('16:9');
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  const flipCamera = () => setCameraType(cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
  const toggleFlash = () => setFlashMode(flashModeOrderDepend[flashMode]);
  const toggleWB = () => setWb(wbOrderDependent[wb]);
  const zoomOut = () => setZoom(zoom - 0.1 < 0 ? 0 : zoom - 0.1);
  const zoomIn = () => setZoom(zoom + 0.1 > 1 ? 1 : zoom + 0.1);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if (status == 'granted') {
        let audioResponse = await Audio.requestPermissionsAsync();
        if (audioResponse.status == 'granted') {
          setHasPermission(status === 'granted');
        }
      }
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        { isFocused && <Camera
          onCameraReady={async () => {
            if (Platform.OS === 'android' && cameraRef) {
              const ratios = await cameraRef.getSupportedRatiosAsync();
              const ratio = ratios[ratios.length - 1];
              setRatio(ratio);
            }
          }}
          type={cameraType}
          ratio={ratio}
          flashMode={flashModeOrder[flashMode]}
          autoFocus={Camera.Constants.AutoFocus.on}
          whiteBalance={wbOrder[wb]}
          style={styles.preview}
          zoom={zoom}
          ref={(ref) => {
            setCameraRef(ref);
          }}
        />}
      </View>
      <Grid style={styles.topToolbar}>
        <Row>
          <Col style={styles.alignCenter}>
            <TouchableOpacity onPress={toggleWB}>
              <Ionicons name={wbIcons[wb]} color='white' size={30} />
            </TouchableOpacity>
          </Col>
          <Col style={styles.alignCenter}>
            <TouchableOpacity onPress={zoomIn}>
              <Ionicons name='ios-add-circle' color='white' size={30} />
            </TouchableOpacity>
          </Col>
          <Col style={styles.alignCenter}>
            <TouchableOpacity onPress={zoomOut}>
              <Ionicons name='md-remove' color='white' size={30} />
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
      {captures.length > 0 && <Gallery captures={captures} navigation={navigation} />}

      <Grid style={styles.bottomToolbar}>
        <Row>
          <Col style={styles.alignCenter}>
            <TouchableOpacity onPress={toggleFlash}>
              <Ionicons name={flashIcons[flashMode]} color='white' size={30} />
            </TouchableOpacity>
          </Col>
          <Col size={2} style={styles.alignCenter}>
            <TouchableWithoutFeedback
              onPressIn={() => {
                setRecording(true);
              }}
              onPressOut={() => {
                if (recording) cameraRef.stopRecording();
              }}
              onLongPress={async () => {
                const videoData = await cameraRef.recordAsync({ quality: Camera.Constants.VideoQuality['4:3'], maxDuration: 18 });
                setRecording(false);
                console.log(videoData);
                await AzureBlobService()
                  .uploadMedia(videoData.uri)
                  .then((rs) => {
                    console.log('==>' + rs);
                  })
                  .catch((e) => console.log(e));
                navigation.navigate('Video', { uri: videoData.uri });
                // setCapture([videoData, ...captures]);
              }}
              onPress={async () => {
                const photoData = await cameraRef.takePictureAsync();
                setRecording(false);
                setCapture([photoData, ...captures]);
              }}
            >
              <View style={[styles.captureBtn, recording && styles.captureBtnActive]}>{recording && <View style={styles.captureBtnInternal} />}</View>
            </TouchableWithoutFeedback>
          </Col>
          <Col style={styles.alignCenter}>
            <TouchableOpacity onPress={flipCamera}>
              <Ionicons name='md-reverse-camera' color='white' size={30} />
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    </View>
  );
}

export default CameraScreen;
