// import React from 'react'
// import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform } from 'react-native'
// import { launchImageLibrary } from 'react-native-image-picker'
// import * as RNFS from 'react-native-fs'
// import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api'
// import FaceMatch from './Components/FaceMatch'
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// interface IProps {
// }

// interface IState {
//   img1: any
//   img2: any
//   similarity: string
//   liveness: string
// }

// var image1 = new MatchFacesImage()
// var image2 = new MatchFacesImage()

// export default class App extends React.Component<IProps, IState> {
//   constructor(props: {} | Readonly<{}>) {
//     super(props)

//     const eventManager = new NativeEventEmitter(RNFaceApi)
//     eventManager.addListener('onCustomButtonTappedEvent', (event: string) => console.log(event))
//     eventManager.addListener('videoEncoderCompletionEvent', (json: string) => {
//       var completion = VideoEncoderCompletion.fromJson(JSON.parse(json))!
//       console.log("VideoEncoderCompletion:");
//       console.log("    success: " + completion.success);
//       console.log("    transactionId: " + completion.transactionId);
//     })
//     eventManager.addListener('livenessNotificationEvent', (json: string) => {
//       var notification = LivenessNotification.fromJson(JSON.parse(json))!
//       console.log("LivenessProcessStatus: " + notification.status);
//     })

//     var onInit = (json: string) => {
//       var response = JSON.parse(json)
//       if (!response["success"]) {
//         console.log("Init failed: ");
//         console.log(json);
//       } else {
//         console.log("Init complete")
//       }
//     };
//     var Stack = createNativeStackNavigator();
//     var licPath = Platform.OS === 'ios' ? (RNFS.MainBundlePath + "/license/regula.license") : "regula.license"
//     var readFile = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets
//     readFile(licPath, 'base64').then((license) => {
//       var config = new InitializationConfiguration();
//       config.license = license
//       FaceSDK.initializeWithConfig(config, onInit, (_e: any) => { })
//     }).catch(e => {
//       FaceSDK.initialize(onInit, (_e: any) => { })
//     })

//     this.state = {
//       img1: require('./images/portrait.png'),
//       img2: require('./images/portrait.png'),
//       similarity: "nil",
//       liveness: "nil"
//     }
//   }

//   pickImage(first: boolean) {
//     Alert.alert("Select option", "", [
//       {
//         text: "Use gallery",
//         onPress: () => launchImageLibrary({
//           mediaType: 'photo',
//           selectionLimit: 1,
//           includeBase64: true
//         }, (response: any) => {
//           if (response.assets == undefined) return
//           this.setImage(first, response.assets[0].base64!, Enum.ImageType.PRINTED)
//         })
//       },
//       {
//         text: "Use camera",
//         onPress: () => FaceSDK.presentFaceCaptureActivity((json: string) => {
//           var response = FaceCaptureResponse.fromJson(JSON.parse(json))!
//           if (response.image != null && response.image.bitmap != null)
//             this.setImage(first, response.image.bitmap, Enum.ImageType.LIVE)
//         }, _e => { })
//       }], { cancelable: true })
//   }

//   setImage(first: boolean, base64: string, type: number) {
//     if (base64 == null) return
//     this.setState({ similarity: "null" })
//     if (first) {
//       image1.bitmap = base64
//       image1.imageType = type
//       this.setState({ img1: { uri: "data:image/png;base64," + base64 } })
//       this.setState({ liveness: "null" })
//     } else {
//       image2.bitmap = base64
//       image2.imageType = type
//       this.setState({ img2: { uri: "data:image/png;base64," + base64 } })
//     }
//   }

//   clearResults() {
//     this.setState({ img1: require('./images/portrait.png') })
//     this.setState({ img2: require('./images/portrait.png') })
//     this.setState({ similarity: "null" })
//     this.setState({ liveness: "null" })
//     image1 = new MatchFacesImage()
//     image2 = new MatchFacesImage()
//   }

//   matchFaces() {
//     if (image1 == null || image1.bitmap == null || image1.bitmap == "" || image2 == null || image2.bitmap == null || image2.bitmap == "")
//       return
//     this.setState({ similarity: "Processing..." })
//     var request = new MatchFacesRequest()
//     request.images = [image1, image2]
//     FaceSDK.matchFaces(JSON.stringify(request), (json: string) => {
//       var response = MatchFacesResponse.fromJson(JSON.parse(json))
//       FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response!.results), 0.75, str => {
//         var split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))!
//         this.setState({ similarity: split.matchedFaces!.length > 0 ? ((split.matchedFaces![0].similarity! * 100).toFixed(2) + "%") : "error" })
//       }, e => { this.setState({ similarity: e }) })
//     }, e => { this.setState({ similarity: e }) })
//   }

//   liveness() {
//     FaceSDK.startLiveness((json: string) => {
//       var response = LivenessResponse.fromJson(JSON.parse(json))!
//       if (response.bitmap != null) {
//         this.setImage(true, response.bitmap, Enum.ImageType.LIVE)
//         this.setState({ liveness: response["liveness"] == Enum.LivenessStatus.PASSED ? "passed" : "unknown" })
//       }
//     }, _e => { })
//   }
  
//   render() {
//     return (
//       // <SafeAreaView style={styles.container}>

//       //   <View style={{ padding: 15 }}>
//       //     <TouchableOpacity onPress={() => this.pickImage(true)} style={{ alignItems: "center" }}>
//       //       <Image source={this.state.img1} resizeMode="contain" style={{ height: 150, width: 150 }} />
//       //     </TouchableOpacity>
//       //     <TouchableOpacity onPress={() => this.pickImage(false)} style={{ alignItems: "center" }}>
//       //       <Image source={this.state.img2} resizeMode="contain" style={{ height: 150, width: 200 }} />
//       //     </TouchableOpacity>
//       //   </View>

//       //   <View style={{ width: "100%", alignItems: "center" }}>
//       //     <View style={{ padding: 3, width: "60%" }}>
//       //       <Button title="Match" color="#4285F4" onPress={() => { this.matchFaces() }} />
//       //     </View>
//       //     <View style={{ padding: 3, width: "60%" }}>
//       //       <Button title="Liveness" color="#4285F4" onPress={() => { this.liveness() }} />
//       //     </View>
//       //     <View style={{ padding: 3, width: "60%" }}>
//       //       <Button title="Clear" color="#4285F4" onPress={() => { this.clearResults() }} />
//       //     </View>
//       //   </View>

//       //   <View style={{ flexDirection: 'row', padding: 10 }}>
//       //     <Text>Similarity: {this.state.similarity}</Text>
//       //     <View style={{ padding: 10 }} />
//       //     <Text>Liveness: {this.state.liveness}</Text>
//       //   </View>
//       // </SafeAreaView>
     
//       <NavigationContainer>
//       <Stack.Navigator>
//       <Stack.Screen name="home" component={HomeScreen} />
//         <Stack.Screen name="facematch" component={FaceMatch} />
//       </Stack.Navigator>
//     </NavigationContainer>
//     )
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     height: '100%',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//     marginBottom: 12,
//   },
// });


import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform } from 'react-native';
import HomeScreen from './Components/HomeScreen';
import FaceMatch from './Components/FaceMatch';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from './Components/RegisterScreen';
import { initDatabase } from './Database/Database';
import MakePayment from './Components/MakePayment';
import PaymentScreen from './Components/PaymentScreen';
const App = () => {
  useEffect(() => {
    initDatabase();
  }, []);
const Stack=createNativeStackNavigator()
 return (
  <NavigationContainer>
           <Stack.Navigator initialRouteName="home">
         <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="facematch" component={FaceMatch} />
          <Stack.Screen name="register" component={RegisterScreen} />
          <Stack.Screen name="makepayment" component={MakePayment} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen}/>
         </Stack.Navigator>
     </NavigationContainer>

 );
};

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

export default App;


// import React from 'react';
// import { SafeAreaView, StyleSheet, View } from 'react-native';
// import FaceRecognitionComponent from './Components/FaceRecognitionComponent'; // Adjust the path as necessary

// const App = () => {
//  return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <FaceRecognitionComponent />
//       </View>
//     </SafeAreaView>
//  );
// };

// const styles = StyleSheet.create({
//  container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//  },
//  content: {
//     width: '100%',
//     padding: 20,
//  },
// });

// export default App;
