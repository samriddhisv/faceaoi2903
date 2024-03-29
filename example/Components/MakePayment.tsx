import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform, TextInput, ActivityIndicator } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import * as RNFS from 'react-native-fs'
import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api'
import { getAllImages } from '../Database/Database'
import axios from 'axios';
// import OneUpi from 'one-react-native-upi'; // Make sure to install one-react-native-upi
import { NavigationProp } from '@react-navigation/native';
import PaymentScreen from './PaymentScreen'
// Add NavigationProp to the props interface
interface IProps {
 navigation: NavigationProp<any>;
}
interface ImageObject {
  uri: string;
  number: string
  upiId:string
  // Include other properties of the image objects if necessary
 }
interface IState {
  img1: any
  img2: any
  similarity: string
  allImages: ImageObject[]
  matchedPhoneNumber?: string// Add this line to include the matchedPhoneNumber property
  upiId?: string; // Add this line to include the upiId property
  // amount: string; // Add this line to include the paymentAmount property
  isLoading: boolean; // New state variable to control the loader


}
var image1 = new MatchFacesImage()
var image2 = new MatchFacesImage()

export default class MakePayment extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)

    const eventManager = new NativeEventEmitter(RNFaceApi)

    eventManager.addListener('onCustomButtonTappedEvent', (event: string) => console.log(event))
    eventManager.addListener('videoEncoderCompletionEvent', (json: string) => {
      var completion = VideoEncoderCompletion.fromJson(JSON.parse(json))!
      console.log("VideoEncoderCompletion:");
      console.log("    success: " + completion.success);
      console.log("    transactionId: " + completion.transactionId);
    })
    eventManager.addListener('livenessNotificationEvent', (json: string) => {
      var notification = LivenessNotification.fromJson(JSON.parse(json))!
      console.log("LivenessProcessStatus: " + notification.status);
    })

    var onInit = (json: string) => {
      var response = JSON.parse(json)
      if (!response["success"]) {
        console.log("Init failed: ");
        console.log(json);
      } else {
        console.log("Init complete")
      }
    };

    var licPath = Platform.OS === 'ios' ? (RNFS.MainBundlePath + "/license/regula.license") : "regula.license"
    var readFile = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets
    readFile(licPath, 'base64').then((license) => {
      var config = new InitializationConfiguration();
      config.license = license
      FaceSDK.initializeWithConfig(config, onInit, (_e: any) => { })
    }).catch(e => {
      FaceSDK.initialize(onInit, (_e: any) => { })
    })

    this.state = {
      img1: require('../images/portrait.png'),
      img2: require('../images/portrait.png'),
      similarity: "nil",
      allImages:[],
      upiId: undefined, // Initialize upiId state
      // amount: '', // Initialize paymentAmount state
      isLoading: false, // Initialize isLoading state



    }
  }
  fetchAllImages = () => {
    getAllImages()
       .then(images => {
         this.setState({ allImages: images });
       })
       .catch(error => {
         console.error('Error fetching all images:', error);
         // Optionally, handle the error in your UI
       });
   };
   componentDidMount() {
    this.fetchAllImages();
 }
 componentDidUpdate(prevProps, prevState) {
  // Check if allImages has been updated and is not empty
  if (prevState.allImages !== this.state.allImages && this.state.allImages.length > 0) {
     // Now it's safe to access the first element
     console.log(`First Image URI: ${this.state.allImages[0].uri}`);
  }
 }
 
   
  pickImage(first: boolean) {
    Alert.alert("Select option", "", [
      {
        text: "Use gallery",
        onPress: () => launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 1,
          includeBase64: true
        }, (response: any) => {
          console.log(response);
          if (response.assets == undefined) return
          this.setImage(first, response.assets[0].base64!, Enum.ImageType.PRINTED)
        })
      },
      {
        text: "Use camera",
        onPress: () => FaceSDK.presentFaceCaptureActivity((json: string) => {
          var response = FaceCaptureResponse.fromJson(JSON.parse(json))!
          if (response.image != null && response.image.bitmap != null)
            this.setImage(first, response.image.bitmap, Enum.ImageType.LIVE)
        }, _e => { })
      }], { cancelable: true })
  }

  setImage(first: boolean, base64: string, type: number) {
    if (base64 == null) return
    this.setState({ similarity: "null" })
    if (first) {
      image1.bitmap = base64
      image1.imageType = type
      this.setState({ img1: { uri: "data:image/png;base64," + base64 } })
    } else {
      image2.bitmap = base64
      image2.imageType = type
      this.setState({ img2: { uri: "data:image/png;base64," + base64 } })
    }
    
    this.matchFaces();

  }
//   fetchUpiId = async (phoneNumber: string, callback) => {
//     const upiExtensions = ["apl", "ybl", "oksbi", "okhdfcbank", "axl", "paytm", "ibl", "upi", "icici", "sbi", "kotak", "postbank", "axisbank", "okicici", "okaxis", "dbs", "barodampay", "idfcbank"];
//     let vpa = phoneNumber;

//     for (const extension of upiExtensions) {
//       const fullVpa = `${vpa}@${extension}`;
//       const url = 'https://upi-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_vpa';

//       const payload = {
//         task_id: 'UUID', // You should generate a UUID for task_id and group_id
//         group_id: 'UUID',
//         data: { vpa: fullVpa }
//       };

//       const headers = {
//         'content-type': 'application/json',
//         'X-RapidAPI-Key': '18d2e0645amsh030374d2869e30cp1fb19cjsn0ff61b9395b9', // Set your API key here
//         'X-RapidAPI-Host': 'upi-verification.p.rapidapi.com'
//       };

//       try {
//         const response = await axios.post(url, payload, { headers });
//         console.log(response.data);

//         if (response.data.result && response.data.result.status === 'id_found') {
//           this.setState({ upiId: response.data.result.vpa });
//           break; // Exit the loop
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     callback();
    
//  };

// fetchUpiId = async (phoneNumber: string) => {
//   // Example UPI ID
//   const exampleUpiId = "7022956986@ybl";

//   // Set the UPI ID directly without making an API call
//   this.setState({ upiId: exampleUpiId });
// };


matchFaces() {
  if (image1 == null || image1.bitmap == null || image1.bitmap == "" || this.state.allImages.length === 0) {
     return;
  }
  this.setState({ similarity: "Processing...", isLoading: true }); // Show loader
 
  let matchFound = false;
  // Iterate over allImages to find a match
  for (let i = 0; i < this.state.allImages.length && !matchFound; i++) {
     const image2 = new MatchFacesImage();
     image2.bitmap = this.state.allImages[i].uri; // Assuming the URI is directly usable
     image2.imageType = Enum.ImageType.PRINTED; // Adjust the image type as necessary
 
     var request = new MatchFacesRequest();
     request.images = [image1, image2];
 
     FaceSDK.matchFaces(JSON.stringify(request), (json: string) => {
       var response = MatchFacesResponse.fromJson(JSON.parse(json));
       FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response!.results), 0.75, str => {
         var split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))!;
         if (split.matchedFaces!.length > 0) {
           // Match found, log the number and stop searching
           console.log(`Match found with similarity: ${(split.matchedFaces![0].similarity! * 100).toFixed(2)}%`);
           console.log(`Respective number: ${this.state.allImages[i].number}`); // Assuming each image object has a 'number' property
           matchFound = true; // Set the flag to true
           this.setState({ similarity: split.matchedFaces!.length > 0 ? ((split.matchedFaces![0].similarity! * 100).toFixed(2) + "%") : "error", matchedPhoneNumber: this.state.allImages[i].number, upiId: this.state.allImages[i].upiId });
           // No need to fetch UPI ID from an external service since it's already available in the database
          //  this.props.navigation.navigate('PaymentScreen', {
          //    phoneNumber: this.state.matchedPhoneNumber,
          //    upiId: this.state.upiId,
          //  });
           this.setState({ isLoading: false }); // Hide loader
         }
       }, e => {
         console.error('Error in matchFacesSimilarityThresholdSplit:', e);
       });
     }, e => {
       console.error('Error in matchFaces:', e);
     });
  }
 }
 
   
  //  initiatePayment = () => {
  //   if (!this.state.upiId) {
  //      // Handle the case where upiId is not defined
  //      console.error('UPI ID is not defined. Cannot initiate payment.');
  //      return;
  //   }
   
  //   const config = {
  //      upiId: this.state.upiId,
  //      name: 'Samriddhi',
  //      note: 'Test payment',
  //      amount: this.state.amount,
  //      // targetPackage: "in.org.npci.upiapp", // Uncomment this line if you want to target a specific UPI app
  //   };
   
  //   const onSuccess = (success) => {
  //      console.log({ success });
  //      // Handle success response here
  //   };
   
  //   const onFailure = (error) => {
  //      console.log({ error });
  //      // Handle failure response here
  //   };
   
  //   OneUpi.initiate(config, onSuccess, onFailure);
  //  };
  render() {
    if (this.state.matchedPhoneNumber && this.state.upiId) {
      return <PaymentScreen route={{ params: { phoneNumber: this.state.matchedPhoneNumber, upiId: this.state.upiId } }} />;   }
    return (
      <SafeAreaView style={styles.container}>
{this.state.isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
        <View style={{ padding: 15 }}>
          <TouchableOpacity onPress={() => this.pickImage(true)} style={{ alignItems: "center" }}>
            {/* <Text>{this.state.img1}</Text> */}
            <Image source={this.state.img1} resizeMode="contain" style={{ height: 150, width: 150 }} />
          </TouchableOpacity>
        </View>
        )}
        {/* <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ padding: 3, width: "60%" }}>
            <Button title="Match" color="#4285F4" onPress={() => { this.matchFaces() }} />
          </View>
        </View> */}

        {/* <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text>Similarity: {this.state.similarity}</Text>
          <View style={{ padding: 10 }} />
        </View>
        <View style={{ flexDirection: 'row', padding: 10 }}>
        {this.state.matchedPhoneNumber && <Text>Phone Number: {this.state.matchedPhoneNumber}</Text>}
        {this.state.upiId && <Text>UPI ID: {this.state.upiId}</Text>}

      </View> */}
      </SafeAreaView>
    )
  };

}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 12,
  },
});
