// import React, { useState, useEffect } from 'react';
// import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import * as RNFS from 'react-native-fs';
// import { getAllImages } from '../Database/Database';
// import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api';

// const FaceMatch = () => {
//     const fetchImagesFromDatabase = () => {
//         return getAllImages()
//           .then(data => {
//             if (data.length === 0) {
//               console.error('No images found in the database.');
//               return []; // Return an empty array if no images are found
//             }
//             // Log each item in the data array
//             data.forEach(item => {
//                 console.log("Item from database:", item);
//                 console.log("Item uri type:", typeof item.uri);
//                 console.log("Item uri value:", item.uri);
//                });
               
//             // Return the array of images, ensuring uri is a string
//             return data.map(item => ({  
//                 uri: typeof item.uri === 'string' ? item.uri : item.uri.toString(),
//               number: item.number
//             }));
//           })
//           .catch(error => {
//             console.error('Error fetching images from database:', error);
//             return []; // Return an empty array in case of an error
//           });
//     };
    
    
    
//  const [img1, setImg1] = useState(require('../images/portrait.png'));
//  const [img2, setImg2] = useState(require('../images/portrait.png'));
//  const [image1, setImage1] = useState<MatchFacesImage | null>(null);
// const [image2, setImage2] = useState<MatchFacesImage | null>(null);

//  const [similarity, setSimilarity] = useState("nil");
//  const [livenessStatus, setLiveness] = useState("nil");

//  useEffect(() => {
//     const eventManager = new NativeEventEmitter(RNFaceApi);
//     eventManager.addListener('onCustomButtonTappedEvent', (event: string) => console.log(event));
//     eventManager.addListener('videoEncoderCompletionEvent', (json: string) => {
//       var completion = VideoEncoderCompletion.fromJson(JSON.parse(json))!;
//       console.log("VideoEncoderCompletion:");
//       console.log("    success: " + completion.success);
//       console.log("    transactionId: " + completion.transactionId);
//     });
//     eventManager.addListener('livenessNotificationEvent', (json: string) => {
//       var notification = LivenessNotification.fromJson(JSON.parse(json))!;
//       console.log("LivenessProcessStatus: " + notification.status);
//     });

//     var onInit = (json: string) => {
//       var response = JSON.parse(json);
//       if (!response["success"]) {
//         console.log("Init failed: ");
//         console.log(json);
//       } else {
//         console.log("Init complete");
//       }
//     };

//     var licPath = Platform.OS === 'ios' ? (RNFS.MainBundlePath + "/license/regula.license") : "regula.license";
//     var readFile = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets;
//     readFile(licPath, 'base64').then((license) => {
//       var config = new InitializationConfiguration();
//       config.license = license;
//       FaceSDK.initializeWithConfig(config, onInit, (_e: any) => { });
//     }).catch(e => {
//       FaceSDK.initialize(onInit, (_e: any) => { });
//     });
//  }, []);
//  useEffect(() => {
//     fetchImagesFromDatabase(); // Fetch images from database when component mounts
//   }, []);

// //  const pickImage = (first: boolean) => {
// //     Alert.alert("Select option", "", [
// //       {
// //         text: "Use gallery",
// //         onPress: () => launchImageLibrary({
// //           mediaType: 'photo',
// //           selectionLimit: 1,
// //           includeBase64: true
// //         }, (response: any) => {
// //           if (response.assets == undefined) return;
// //           setImage(first, response.assets[0].base64!, Enum.ImageType.PRINTED);
// //         })
// //       },
// //       {
// //         text: "Use camera",
// //         onPress: () => FaceSDK.presentFaceCaptureActivity((json: string) => {
// //           var response = FaceCaptureResponse.fromJson(JSON.parse(json))!;
// //           if (response.image != null && response.image.bitmap != null)
// //             setImage(first, response.image.bitmap, Enum.ImageType.LIVE);
// //         }, _e => { })
// //       }], { cancelable: true });
// //  };
// const pickImage = () => {
//     Alert.alert("Select option", "", [
//       {
//         text: "Use gallery",
//         onPress: () => launchImageLibrary({
//           mediaType: 'photo',
//           selectionLimit: 1,
//           includeBase64: true
//         }, (response: any) => {
//           if (response.assets == undefined) return;
//           setImage(response.assets[0].base64!, Enum.ImageType.PRINTED);
//         })
//       },
//       {
//         text: "Use camera",
//         onPress: () => FaceSDK.presentFaceCaptureActivity((json: string) => {
//           var response = FaceCaptureResponse.fromJson(JSON.parse(json))!;
//           if (response.image != null && response.image.bitmap != null)
//             setImage(response.image.bitmap, Enum.ImageType.LIVE);
//         }, _e => { })
//       }], { cancelable: true });
// };


// //  const setImage = (first: boolean, base64: string, type: number) => {
// //   if (base64 == null) return;
// //   setSimilarity("null");
// //   if (first) {
// //      setImage1(new MatchFacesImage()); // Initialize a new MatchFacesImage
// //      setImage1(prev => ({ ...prev, bitmap: base64, imageType: type })); // Update the state
// //      setImg1({ uri: "data:image/png;base64," + base64 });
// //      setLiveness("null");
// //   } else {
// //      setImage2(new MatchFacesImage()); // Initialize a new MatchFacesImage
// //      setImage2(prev => ({ ...prev, bitmap: base64, imageType: type })); // Update the state
// //      setImg2({ uri: "data:image/png;base64," + base64 });
// //   }
// //  };
// const setImage = (base64: string, type: number) => {
//     if (base64 == null) return;
//     // Ensure the base64 string is correctly formatted
//     const base64String = typeof base64 === 'string' ? base64 : JSON.stringify(base64);
//     setSimilarity("null");
//     setImage1(new MatchFacesImage()); // Initialize a new MatchFacesImage
//     setImage1(prev => ({ ...prev, bitmap: base64String, imageType: type })); // Update the state
//     setImg1({ uri: "data:image/png;base64," + base64String });
//     setLiveness("null");
// };

   
 

//  const clearResults = () => {
//   setImg1(require('../images/portrait.png'));
//   setImg2(require('../images/portrait.png'));
//   setSimilarity("null");
//   setLiveness("null");
//   setImage1(new MatchFacesImage()); // Use setImage1 to reset image1
//   setImage2(new MatchFacesImage()); // Use setImage2 to reset image2
// };


// //  const matchFaces = () => {
// //     if (image1 == null || image1.bitmap == null || image1.bitmap == "" || image2 == null || image2.bitmap == null || image2.bitmap == "")
// //       return;
// //     setSimilarity("Processing...");
// //     var request = new MatchFacesRequest();
// //     request.images = [image1, image2];
// //     FaceSDK.matchFaces(JSON.stringify(request), (json: string) => {
// //       var response = MatchFacesResponse.fromJson(JSON.parse(json));
// //       FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response!.results), 0.75, str => {
// //         var split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))!;
// //         setSimilarity(split.matchedFaces!.length > 0 ? ((split.matchedFaces![0].similarity! * 100).toFixed(2) + "%") : "error");
// //       }, e => { setSimilarity(e) });
// //     }, e => { setSimilarity(e) });
// //  };
// const extractBase64FromUri = (uri) => {
//     // Check if the URI starts with the expected prefix
//     if (uri.startsWith("data:image/png;base64,")) {
//        // Extract the base64 part of the URI
//        const base64 = uri.substring("data:image/png;base64,".length);
//        return base64;
//     }
//     // If the URI does not start with the expected prefix, return null or handle as needed
//     return null;
//    };
//    const matchFaces = async () => {
//     console.log("called me")
//     if (image1 == null || image1.bitmap == null || image1.bitmap == "") {
//         console.log("No image1 captured.");
//         return;
//     }

//     setSimilarity("Processing...");

//     // Fetch all images from the database
//     const imagesFromDatabase = await fetchImagesFromDatabase();
//     if (!imagesFromDatabase || imagesFromDatabase.length === 0) {
//         console.log("No images found in the database.");
//         setSimilarity("No images found in the database.");
//         return;
//     }

//     // Iterate over each image in the database
//     for (const dbImage of imagesFromDatabase) {
//         console.log("inside loop");
//         const stringUri=''+extractBase64FromUri(dbImage.uri)
//         console.log(''+stringUri)
//         const dbImageUriString = typeof dbImage.uri === 'string' ? dbImage.uri : JSON.stringify(dbImage.uri);
//         const base64Object = extractBase64FromUri(dbImageUriString);

//         // Assuming base64Object is an object with a property that contains the base64 string
//         // You need to adjust this line based on the actual structure of base64Object
//         const base64String = base64Object ? base64Object.base64 : null;

//         if (!base64String) {
//             console.log("Failed to extract base64 string from URI.");
//             continue; // Skip this iteration if the base64 string cannot be extracted
//         }

//         // Use a local variable for image2 instead of the state variable
//         const image2Local = new MatchFacesImage();
//         image2Local.bitmap = base64String; // Ensure this is a string
//         image2Local.imageType = Enum.ImageType.LIVE;

//         // Now you can use image2Local immediately
//         console.log(image1);
//         console.log(image2Local);

//         // Your existing code to match faces...
//         var request = new MatchFacesRequest();
//         request.images = [image1, image2Local]; // Use image2Local here

//         // Attempt to match image1 with the current database image
//         try {
//             await new Promise((resolve, reject) => {
//                 FaceSDK.matchFaces(JSON.stringify(request), (json: string) => {
//                     var response = MatchFacesResponse.fromJson(JSON.parse(json));
//                     FaceSDK.matchFacesSimilarityThresholdSplit(JSON.stringify(response!.results), 0.75, str => {
//                         var split = MatchFacesSimilarityThresholdSplit.fromJson(JSON.parse(str))!;
//                         if (split.matchedFaces!.length > 0) {
//                             setSimilarity((split.matchedFaces![0].similarity! * 100).toFixed(2) + "%");
//                             console.log("Match found.");
//                             resolve(undefined);
//                         } else {
//                             resolve(undefined);
//                         }
//                     }, e => {
//                         setSimilarity(e);
//                         reject(e);
//                     });
//                 }, e => {
//                     setSimilarity(e);
//                     reject(e);
//                 });
//             });

//             if (similarity !== "Processing...") {
//                 break;
//             }
//         } catch (error) {
//             console.error("Error matching faces:", error);
//             setSimilarity("Error matching faces.");
//             break;
//         }
//     }

//     if (similarity === "Processing...") {
//         setSimilarity("No match found.");
//     }
// };


//  const liveness = () => {
//     FaceSDK.startLiveness((json: string) => {
//       var response = LivenessResponse.fromJson(JSON.parse(json))!;
//       if (response.bitmap != null) {
//         setImage(response.bitmap, Enum.ImageType.LIVE);
//         setLiveness(response["liveness"] == Enum.LivenessStatus.PASSED ? "passed" : "unknown");
//       }
//     }, _e => { });
//  };

//  return (
//     <SafeAreaView style={styles.container}>
//       <View style={{ padding: 15 }}>
//        <TouchableOpacity onPress={() => pickImage()} style={{ alignItems: "center" }}>
//           <Image source={img1} resizeMode="contain" style={{ height: 150, width: 150 }} />
//         </TouchableOpacity>
//         {/* <TouchableOpacity onPress={() => pickImage(false)} style={{ alignItems: "center" }}>
//           <Image source={img2} resizeMode="contain" style={{ height: 150, width: 200 }} />
//         </TouchableOpacity> */} 
//       </View>

//       <View style={{ width: "100%", alignItems: "center" }}>
//         <View style={{ padding: 3, width: "60%" }}>
//           <Button title="Match" color="#4285F4" onPress={() => { matchFaces() }} />
//         </View>
//         <View style={{ padding: 3, width: "60%" }}>

//           <Button title="Liveness" color="#4285F4" onPress={() => { liveness() }} />
//         </View>
//         <View style={{ padding: 3, width: "60%" }}>
//           <Button title="Clear" color="#4285F4" onPress={() => { clearResults() }} />
//         </View>
//       </View>

//       <View style={{ flexDirection: 'row', padding: 10 }}>
//         <Text>Similarity: {similarity}</Text>
//         <View style={{ padding: 10 }} />

//         <Text>Liveness: {livenessStatus}</Text>
//       </View>
//     </SafeAreaView>
//  );
// };

// const styles = StyleSheet.create({
//  container: {
//     width: '100%',
//     height: '100%',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//     marginBottom: 12,
//  },
// });

// export default FaceMatch;


// // import React from 'react';
// // import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform } from 'react-native';
// // import { launchImageLibrary } from 'react-native-image-picker';
// // import * as RNFS from 'react-native-fs';
// // import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api';
// // import { getAllImages } from '../Database/Database'; // Ensure this import path is correct

// // class FaceMatch extends React.Component {
// // image1: new MatchFacesImage(), // Initialize image1 in the state
// //       image2: new MatchFacesImage(),
// //  constructor(props) {
// //     super(props);
// //     this.state = {
// //       img1: require('../images/portrait.png'),
// //       img2: require('../images/portrait.png'),
// //       similarity: "nil",
// //       liveness: "nil",
      
// //     };
// //  }

// //  componentDidMount() {
// //     this.fetchFirstImageFromDatabase();
// //  }

// //  fetchFirstImageFromDatabase = async () => {
// //     try {
// //       const images = await getAllImages();
// //       if (images.length > 0) {
// //         const firstImage = images[0];
// //         this.setImage(false, firstImage.uri, Enum.ImageType.PRINTED); // Assuming the URI is directly usable
// //       }
// //     } catch (error) {
// //       console.error('Error fetching first image from database:', error);
// //     }
// //  };

// //  pickImage = (first) => {
// //     Alert.alert("Select option", "", [
// //       {
// //         text: "Use gallery",
// //         onPress: () => launchImageLibrary({
// //           mediaType: 'photo',
// //           selectionLimit: 1,
// //           includeBase64: true
// //         }, (response) => {
// //           if (response.assets == undefined) return;
// //           this.setImage(first, response.assets[0].base64!, Enum.ImageType.PRINTED);
// //         })
// //       },
// //       {
// //         text: "Use camera",
// //         onPress: () => FaceSDK.presentFaceCaptureActivity((json) => {
// //           var response = FaceCaptureResponse.fromJson(JSON.parse(json))!;
// //           if (response.image != null && response.image.bitmap != null)
// //             this.setImage(first, response.image.bitmap, Enum.ImageType.LIVE);
// //         }, _e => { })
// //       }], { cancelable: true });
// //  };

// //  setImage = (first, base64, type) => {
// //     if (base64 == null) return;
// //     this.setState({ similarity: "null" });
// //     if (first) {
// //       this.image1.bitmap = base64;
// //       this.image1.imageType = type;
// //       this.setState({ img1: { uri: "data:image/png;base64," + base64 } });
// //       this.setState({ liveness: "null" });
// //     } else {
// //       this.image2.bitmap = base64;
// //       this.image2.imageType = type;
// //       this.setState({ img2: { uri: "data:image/png;base64," + base64 } });
// //     }
// //  };

// //  // Other methods remain unchanged...

// //  render() {
// //     return (
// //         <SafeAreaView style={styles.container}>

// //       <View style={{ padding: 15 }}>
// //         <TouchableOpacity onPress={() => this.pickImage(true)} style={{ alignItems: "center" }}>
// //           <Image source={this.state.img1} resizeMode="contain" style={{ height: 150, width: 150 }} />
// //         </TouchableOpacity>
// //         <TouchableOpacity onPress={() => this.pickImage(false)} style={{ alignItems: "center" }}>
// //           <Image source={this.state.img2} resizeMode="contain" style={{ height: 150, width: 200 }} />
// //         </TouchableOpacity>
// //       </View>

// //       <View style={{ width: "100%", alignItems: "center" }}>
// //         <View style={{ padding: 3, width: "60%" }}>
// //           <Button title="Match" color="#4285F4" onPress={() => { this.matchFaces() }} />
// //         </View>
// //         <View style={{ padding: 3, width: "60%" }}>
// //           <Button title="Liveness" color="#4285F4" onPress={() => { this.liveness() }} />
// //         </View>
// //         <View style={{ padding: 3, width: "60%" }}>
// //           <Button title="Clear" color="#4285F4" onPress={() => { this.clearResults() }} />
// //         </View>
// //       </View>

// //       <View style={{ flexDirection: 'row', padding: 10 }}>
// //         <Text>Similarity: {this.state.similarity}</Text>
// //         <View style={{ padding: 10 }} />
// //         <Text>Liveness: {this.state.liveness}</Text>
// //       </View>
// //     </SafeAreaView>
// //     );
// //  }
// //     matchFaces() {
// //         throw new Error('Method not implemented.');
// //     }
// //     liveness() {
// //         throw new Error('Method not implemented.');
// //     }
// //     clearResults() {
// //         throw new Error('Method not implemented.');
// //     }
// // }

// // const styles = StyleSheet.create({
// //  container: {
// //     width: '100%',
// //     height: '100%',
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#F5FCFF',
// //     marginBottom: 12,
// //  },
// // });

// // export default FaceMatch;


// import React ,{useState,useEffect}from 'react'
// import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform } from 'react-native'
// import { launchImageLibrary } from 'react-native-image-picker'
// import * as RNFS from 'react-native-fs'
// import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api'
// import { getAllImages } from '../Database/Database'


// interface IProps {
// }

// interface IState {
//   img1: any
//   img2: any
//   similarity: string
//   liveness: string
//   imagesArray:[]
// }

 

// var image1 = new MatchFacesImage()
// var image2 = new MatchFacesImage()

// export default class MakePayment extends React.Component<IProps, IState> {
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
//       img1: require('../images/portrait.png'),
//       img2: require('../images/portrait.png'),
//       similarity: "nil",
//       liveness: "nil",
//       imagesArray: [],
//     }
//   }
//   componentDidMount() {
//     this.fetchImagesFromDatabase(); // Fetch images from database when component mounts
//  }
//  fetchImagesFromDatabase = () => {
//     getAllImages()
//       .then(data => {
//         const images = data
//           .filter(item => item.uri && item.uri.trim() !== '') // Filter out images with empty URIs
//           .map(item => ({
//             uri: item.uri,
//             number: item.number
//           }));
//         this.setState({ imagesArray: images }); // Update the state with the fetched images
//       })
//       .catch(error => {
//         console.error('Error fetching images from database:', error);
//       });
//  };
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
//       console.log(this.state.img1);
//       this.setState({ liveness: "null" })
//     } else {
//       image2.bitmap = base64
//       image2.imageType = type
//       this.setState({ img2: { uri:  "data:image/png;base64,"+base64} })
//     }
//   }

//   clearResults() {
//     this.setState({ img1: require('../images/portrait.png') })
//     this.setState({ img2: require('../images/portrait.png') })
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
//       <SafeAreaView style={styles.container}>

//         <View style={{ padding: 15 }}>
//           <TouchableOpacity onPress={() => this.pickImage(true)} style={{ alignItems: "center" }}>
//             {/* <Text>{this.state.img1}</Text> */}
//             <Image source={this.state.img1} resizeMode="contain" style={{ height: 150, width: 150 }} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => this.pickImage(false)} style={{ alignItems: "center" }}>
//             <Image source={this.state.img2} resizeMode="contain" style={{ height: 150, width: 200 }} />
//           </TouchableOpacity>
//         </View>

//         <View style={{ width: "100%", alignItems: "center" }}>
//           <View style={{ padding: 3, width: "60%" }}>
//             <Button title="Match" color="#4285F4" onPress={() => { this.matchFaces() }} />
//           </View>
//           <View style={{ padding: 3, width: "60%" }}>
//             <Button title="Liveness" color="#4285F4" onPress={() => { this.liveness() }} />
//           </View>
//           <View style={{ padding: 3, width: "60%" }}>
//             <Button title="Clear" color="#4285F4" onPress={() => { this.clearResults() }} />
//           </View>
//         </View>

//         <View style={{ flexDirection: 'row', padding: 10 }}>
//           <Text>Similarity: {this.state.similarity}</Text>
//           <View style={{ padding: 10 }} />
//           <Text>Liveness: {this.state.liveness}</Text>
//         </View>
//       </SafeAreaView>
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
//   fetchUpiId = async (phoneNumber: string) => {
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
//         'X-RapidAPI-Key': '616fc46436mshf1de1667cf0b793p150d27jsne03b8934d375', // Set your API key here
//         'X-RapidAPI-Host': 'upi-verification.p.rapidapi.com'
//       };

//       try {
//         const response = await axios.post(url, payload, { headers });
//         if (response.data.result && response.data.result.status === 'id_found') {
//           this.setState({ upiId: response.data.result.vpa });
//           break; // Exit the loop
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//  };

fetchUpiId = async (phoneNumber: string) => {
  // Example UPI ID
  const exampleUpiId = "7022956986@ybl";

  // Set the UPI ID directly without making an API call
  this.setState({ upiId: exampleUpiId });
};


  matchFaces() {
    if (image1 == null || image1.bitmap == null || image1.bitmap == "" || this.state.allImages.length === 0) {
       return;
    }
    this.setState({ similarity: "Processing..." });
    this.setState({ isLoading: true }); // Show loader

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
             this.setState({ similarity: split.matchedFaces!.length > 0 ? ((split.matchedFaces![0].similarity! * 100).toFixed(2) + "%") : "error",matchedPhoneNumber: this.state.allImages[i].number })
             this.fetchUpiId(this.state.allImages[i].number); // Fetch UPI ID after a match is found
             this.setState({ isLoading: false }); // Hide loader

             this.props.navigation.navigate('PaymentScreen', {
              phoneNumber: this.state.matchedPhoneNumber,
              upiId: this.state.upiId,
            });

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