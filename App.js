import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Animated, Easing } from 'react-native';
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import bgImg from './assets/bg.png'
import cameraIcon from './assets/camera-icon.png'
import error from './assets/errorPopup.png'
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
  const animatedValue = useRef(new Animated.Value(-50)).current


  useEffect(() => {
    const animateErrorMessage = () => {
      animatedValue.setValue(-50)
      Animated.timing(animatedValue, {
        toValue: 200,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false
      }).start();
    };

    if (output === 'unidentified') {
      animateErrorMessage();
    }
  }, [output]);
  

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
      {!isCameraOpened && (output === '' || output === 'unidentified') && (
        <Image source={bgImg} style={styles.bgImg} />
      )} 
      <Text style={styles.title}>NUTRICHECK</Text>

      {output === 'unidentified' &&(
        <Animated.View style={{position: 'absolute',bottom: animatedValue}}>
          <Image source={error}/>
        </Animated.View>
      )}

      {
         capturedImage && !isProcessing && output == '' &&(
          <View style={{ flexDirection: 'col', gap: 20, alignItems: 'center'}}>
            <Image source={{ uri: capturedImage }} style={styles.image} />
            <CustomButton title={"Check"} onPress={proceedOCR} style={{width: 140}} />
            <CustomButton title={"Retake"} onPress={reset} style={{width: 120,backgroundColor: '#ACF970'}}/>
          </View>
        )
      }
      
      {
        (output === 'healthy' || output === 'unhealthy' || output == 'moderate') ?(
        <View>
          <Output result={output} capturedImage={capturedImage}/>
          <CustomButton title={"Home"} onPress={()=>  {
            setOutput('')
            setCapturedImage(null)
          }} style={{width: 120, left: '17%',top: 80}}/>
        </View>
        ) : (
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
                
              </Camera>
             
  
                <TouchableOpacity onPress={takePicture} style={styles.takePictureBtn}>
                  <View style={styles.captureBtn}>
                  </View>
                </TouchableOpacity>
  
              <TouchableOpacity onPress={() => setIsCameraOpened(false)} style={styles.closeCamera}>
                <Text style={{ fontSize: 30, fontWeight: '600',color: 'white' }}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          </View>
        )
      }
      <View style={styles.opencamera}>
                {
                !isCameraOpened && !isProcessing && (output === '' || output === 'unidentified') &&(
                  <CustomButton title={"Take a Shot"} onPress={() =>{
                    setIsCameraOpened(true)
                    setCapturedImage(null)
                    setOutput('')
                    }} src={cameraIcon}/>
                )
              }
              </View>

      {isProcessing && (
        <Loader message={"Tracking"} loading={isProcessing}/>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#F4F8E7'
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 5,
    color: '#459D00',
    marginTop: 60
    
  },
  bgImg: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '50%',
    objectFit: 'fill',
    top: 150
  },
  camera: {
    width: 400,
    height: 500,
  },
  cameraContainer: {
    marginTop: 40,
    width: '100%',
    height: '60%',
    alignItems: 'center',

  },
  image: {
    width: 400,
    height: 500,
    marginTop: 60
  },

  closeCamera: {
    width: 50,
    height: 50,
    backgroundColor: '#ACF970',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  takePictureBtn:{
    position: 'absolute',
    bottom: -150, 
    left: '50%', 
    marginLeft: -40, 
    alignItems: 'center',
    justifyContent: 'center', 
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 2, 
    borderColor: '#459D00',
  },
  opencamera:{
    marginTop: 100,
  },
  captureBtn:{
    backgroundColor: '#459D00',
    width: 72,
    height: 72,
    borderRadius: 100,
  },
  errorMessage:{
    position: 'absolute'
  }
});
