import React, { useState } from 'react';
import { Button, Image, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import faceApiService from './faceApiService';

const FaceRecognitionComponent = () => {
 const [imageUri, setImageUri] = useState(null);

 const captureImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchCamera(options, (response) => {
      console.log('Response:', response); // Log the entire response
      if (response.didCancel) {
         console.log('User cancelled image picker');
      }
      else if (response.assets && response.assets.length > 0) {
        console.log('response', JSON.stringify(response));
        setImageUri(response.assets[0].uri);
      } else {
         console.log('ImagePicker Error: ', response.error);
      } 
     });
     
     
 };

 const recognizeFace = async () => {
    if (!imageUri) {
      alert('Please capture an image first.');
      return;
    }

    try {
      const result = await faceApiService.recognizeFace(imageUri);
      console.log(result);
      // Handle the result as needed
    } catch (error) {
      console.error('Failed to recognize face:', error);
    }
 };
 const identifyFace = async () => {
  if (!imageUri) {
    alert('Please capture an image first.');
    return;
  }

  try {
    // First, detect faces in the image to get face IDs
    const detectionResult = await faceApiService.recognizeFace(imageUri);
    console.log('Detection Result:', detectionResult);

    // Assuming detectionResult contains face IDs, use the first face ID for identification
    if (detectionResult && detectionResult.length > 0) {
      const faceId = detectionResult[0].faceId;
      const identificationResult = await faceApiService.identifyFace(faceId);
      console.log('Identification Result:', identificationResult);
      // Handle the identification result as needed
    }
  } catch (error) {
    console.error('Failed to identify face:', error);
  }
};

 return (
    <View>
      <Button title="Capture Image" onPress={captureImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}
      <Button title="Recognize Face" onPress={recognizeFace} />
      <Button title="Identify Face" onPress={identifyFace} />
    </View>
 );
};

export default FaceRecognitionComponent;
