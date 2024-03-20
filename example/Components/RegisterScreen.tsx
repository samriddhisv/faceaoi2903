import React, { useState,useEffect} from 'react'
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform} from 'react-native';
import * as RNFS from 'react-native-fs';
import { TextInput } from 'react-native-paper';
import { insertImage } from '../Database/Database';
import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api';
export default function RegisterScreen() {
  const [image,setimage]=useState(require('../images/portrait.png'));
  const [mobilenum,setMobilenum]=useState("");
  useEffect(() => {
    const eventManager = new NativeEventEmitter(RNFaceApi);
    eventManager.addListener('onCustomButtonTappedEvent', (event: string) => console.log(event));
    eventManager.addListener('videoEncoderCompletionEvent', (json: string) => {
      var completion = VideoEncoderCompletion.fromJson(JSON.parse(json))!;
      console.log("VideoEncoderCompletion:");
      console.log("    success: " + completion.success);
      console.log("    transactionId: " + completion.transactionId);
    });
    eventManager.addListener('livenessNotificationEvent', (json: string) => {
      var notification = LivenessNotification.fromJson(JSON.parse(json))!;
      console.log("LivenessProcessStatus: " + notification.status);
    });

    var onInit = (json: string) => {
      var response = JSON.parse(json);
      if (!response["success"]) {
        console.log("Init failed: ");
        console.log(json);
      } else {
        console.log("Init complete");
      }
    };

    var licPath = Platform.OS === 'ios' ? (RNFS.MainBundlePath + "/license/regula.license") : "regula.license";
    var readFile = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
    readFile(licPath, 'base64').then((license) => {
      var config = new InitializationConfiguration();
      config.license = license;
      FaceSDK.initializeWithConfig(config, onInit, (_e: any) => { });
    }).catch(e => {
      FaceSDK.initialize(onInit, (_e: any) => { });
    });
 }, []);
  const pickImage = (first: boolean) => {
    Alert.alert("Select option", "", [
      {
        text: "Use gallery",
        onPress: () => launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 1,
          includeBase64: true
        }, (response: any) => {
          if (response.assets == undefined) return;
          setImage(first, response.assets[0].base64!, Enum.ImageType.PRINTED);
        })
      },
      {
        text: "Use camera",
        onPress: () => FaceSDK.presentFaceCaptureActivity((json: string) => {
          var response = FaceCaptureResponse.fromJson(JSON.parse(json))!;
          if (response.image != null && response.image.bitmap != null)
            setImage(first, response.image.bitmap, Enum.ImageType.LIVE);
        
        }, _e => { })
      }], { cancelable: true });
 };
 const setImage = (first: boolean, base64: string, type: number) => {
  if (base64 == null) return;
  const base64String = typeof base64 === 'string' ? base64 : JSON.stringify(base64);
  if (first) {
     setimage({ uri: "data:image/png;base64," + base64 });
     console.log("IMAGEEEEEEEEEEE",image);
  }
 };
 const addToDatabase=()=>{
  insertImage({ uri: "data:image/png;base64," + image,number: mobilenum })
  .then(() => {
           // Navigate to the 'success' screen only after the image is successfully inserted
          console.log('registered',mobilenum)
          console.log(image)
         })
         .catch(error => {
                 console.error('Error inserting image:', error);
               });
 };
  return (
    <SafeAreaView >
       <TextInput
        label="Mobile Number"
      value={mobilenum}
      onChangeText={text => setMobilenum(text)}
    />
      <Button
        title="Capture Image"
        color="#4285F4"
        onPress={() => pickImage(true)}
      />
      <Button
        title="Capture Image"
        color="#4285F4"
        onPress={() => addToDatabase()}
      />
      <Image source={image} resizeMode="contain" style={{ height: 150, width: 150 }} />
      </SafeAreaView>
  )
}
