import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import bgImg from './assets/nutrition.jpg'
import cameraIcon from './assets/camera.png'
import axios from 'axios';
import CustomButton from './components/CustomButton.js'
import Loader from './components/Loader.js'
import Output from './components/Output.js'

export default function App() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCameraOpened, setIsCameraOpened] = useState(false)
  const [output, setOutput] = useState('')
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
  const cameraRef = useRef(null)

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, [])

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1.0, base64: true, skipProcessing: true };
      try {
        const data = await cameraRef.current.takePictureAsync(options)
        setCapturedImage(data.uri)
      } catch (e) {
        console.log(e)
      }
    }
  }

  const reset = () => {
    setCapturedImage(null)
    setIsProcessing(false)
  }

  const proceedOCR = async () => {
    setIsProcessing(true)
    setCapturedImage(null)
    setIsCameraOpened(false)

    const formData = new FormData();
    formData.append('image', {
      uri: capturedImage,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    try {
      // const response = await axios.get('http://192.168.211.1:8000/')
      const response = await axios.post('http://192.168.211.1:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setOutput(data)
        setIsProcessing(false)
        console.log(data);
      } else {
        console.error('Failed to upload image:', response.status);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }

  }

  return (
    <View style={styles.container}>
      <Image source={bgImg} style={styles.bgImg} />
      <Text style={styles.title}>NutriCheck</Text>
      <TouchableOpacity onPress={() => {
        setIsCameraOpened(true)
        setOutput('')
      }}>
        <View style={styles.iconContainer}>
          <Image source={cameraIcon} style={styles.icon} />
          <Text style={styles.iconTitle}>Open Camera</Text>
        </View>
      </TouchableOpacity>

      {
         capturedImage && !isProcessing && (
          <View style={{ flexDirection: 'col', gap: 20, alignItems: 'center'}}>
            <Image source={{ uri: capturedImage }} style={styles.image} />
            <CustomButton title={"Retake"} onPress={reset} style={{width: 100}}/>
            <CustomButton title={"Process"} onPress={proceedOCR} style={{width: 100}} />
          </View>
        )
      }
      
      {
        output != '' && (
          <Output result={output}/>
        )
      }
      <View style={styles.cameraContainer}>
        {!capturedImage && isCameraOpened && (
          <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
            <Camera
              style={styles.camera}
              type={type}
              flashMode={flash}
              ref={cameraRef}
              autoFocus={Camera.Constants.AutoFocus.on}
            >  
              <View style={styles.buttonContainer}>
                <CustomButton title={"Take Picture"} onPress={takePicture}/>
              </View>
            </Camera>
            <TouchableOpacity onPress={() => setIsCameraOpened(false)} style={styles.closeCamera}>
              <Text style={{ fontSize: 30, fontWeight: '600',color: 'white' }}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isProcessing && (
        <Loader message={"Procesing..."} loading={isProcessing}/>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 5,
    color: 'green',
    marginTop: 40
  },
  bgImg: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  camera: {
    width: '80%',
    flex: 1
  },
  cameraContainer: {
    marginTop: 40,
    width: '100%',
    height: '60%',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 400,
  },
  icon: {
    width: 60,
    height: 60,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconTitle: {
    fontSize: 20,
    fontWeight: '600'
  },
  closeCamera: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  buttonContainer:{
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  }
});
