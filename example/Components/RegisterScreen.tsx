// import React, { useState,useEffect} from 'react'
// import { launchImageLibrary,launchCamera } from 'react-native-image-picker';
// import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform} from 'react-native';
// import * as RNFS from 'react-native-fs';
// import { TextInput } from 'react-native-paper';
// import { insertImage } from '../Database/Database';
// import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api';
// export default function RegisterScreen() {
//   const [image,setimage]=useState(require('../images/portrait.png'));
//   const [mobilenum,setMobilenum]=useState("");
//   const [imageUri, setImageUri] = useState('');
//   useEffect(() => {
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
//   const pickImage = (first: boolean) => {
//     Alert.alert("Select option", "", [
//       {
//         text: "Use gallery",
//         onPress: () => launchImageLibrary({
//           mediaType: 'photo',
//           selectionLimit: 1,
//           includeBase64: true
//         }, (response: any) => {
//           if (response.assets == undefined) return;
//           setImage(first, response.assets[0].base64!, Enum.ImageType.PRINTED);
//           setImageUri(response.assets[0].uri!);
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
//  };
//  const setImage = (first: boolean, base64: string, type: number) => {
//   if (base64 == null) return;
//   const base64String = typeof base64 === 'string' ? base64 : JSON.stringify(base64);
//   if (first) {
//      setimage({ uri: "data:image/png;base64," + base64 });
//      setImageUri(this.state.img1);
//      console.log(this.state.img1);
//      console.log("IMAGEEEEEEEEEEE",image);
//   }
//  };
//  const addToDatabase=()=>{
//   insertImage({ uri: "data:image/png;base64," + image,number: mobilenum })
//   .then(() => {
//            // Navigate to the 'success' screen only after the image is successfully inserted
//           console.log('registered',mobilenum)
//           console.log(image)
//          })
//          .catch(error => {
//                  console.error('Error inserting image:', error);
//                });
//  };
//   return (
//     <SafeAreaView >
//        <TextInput
//         label="Mobile Number"
//       value={mobilenum}
//       onChangeText={text => setMobilenum(text)}
//     />
//       <Button
//         title="Capture Image"
//         color="#4285F4"
//         onPress={() => pickImage(true)}
//       />
//       <Button
//         title="Capture Image"
//         color="#4285F4"
//         onPress={() => addToDatabase()}
//       />
//       <Image source={image} resizeMode="contain" style={{ height: 150, width: 150 }} />
//       </SafeAreaView>
//   )
// }

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Dimensions, Button, Image } from 'react-native';
// import { TextInput } from 'react-native-paper';
// import { launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';

// const RegisterScreen = () => {
//   const [mobilenum, setMobilenum] = useState('');
//   const [fileUri, setFileUri] = useState('');

//   const options = {
//     mediaType: 'photo',
//     storageOptions: {
//       skipBackup: true,
//       path: 'images',
//     },
//   };

//   const launchCameraHandler = () => {
//     launchCamera(options, response => {
//       console.log('Response = ', response);
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.assets && response.assets.length > 0) {
//         console.log('response', JSON.stringify(response));
//         setFileUri(response.assets[0].uri);
//       } else {
//         console.log('No assets selected');
//       }
//     });
//   };

//   const renderFileUri = () => {
//     if (fileUri) {
//       return <Image source={{ uri: fileUri }} style={styles.images} />;
//     } else {
//       return <></>;
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Registration Page</Text>
//       <TextInput
//         variant="outlined"
//         label="Mobile Number"
//         value={mobilenum}
//         onChangeText={setMobilenum}
//       />
//       <Button
//         style={{ width: '50%', alignSelf: 'center', justifyContent: 'center' }}
//         title="Register"
//         onPress={launchCameraHandler}
//       />
//       {renderFileUri()}
//     </View>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({
//   body: {
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     borderColor: 'black',
//     borderWidth: 1,
//     height: Dimensions.get('screen').height - 20,
//     width: Dimensions.get('screen').width,
//   },
//   images: {
//     width: 250,
//     height: 250,
//     borderColor: 'black',
//     borderWidth: 1,
//     marginHorizontal: 3,
//   },
// });

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Dimensions, Button, Image } from 'react-native';
// import { TextInput } from 'react-native-paper';
// import { insertImage } from '../Database/Database';
// import { launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';

// const RegisterScreen = () => {
//   const [mobilenum, setMobilenum] = useState('');
//   const [fileUri, setFileUri] = useState('');

//   const options = {
//     mediaType: 'photo',
//     storageOptions: {
//       skipBackup: true,
//       path: 'images',
//     },
//     includeBase64: true
//   };

//   const launchCameraHandler = () => {
//     launchCamera(options, response => {
//       console.log('Response = ', response);
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.assets && response.assets.length > 0) {
//         console.log('response', JSON.stringify(response));
//         setFileUri(response.assets[0].base64);
//       } else {
//         console.log('No assets selected');
//       }
//     });
//   };

//   const renderFileUri = () => {
//     if (fileUri) {
//       return <Image source={{ uri: fileUri }} style={styles.images} />;
//     } else {
//       return <></>;
//     }
//   };
//   const addtoDataBase = async () => {
//     try {
//        await insertImage({ uri: fileUri, number: mobilenum });
//        console.log("Link-------------------------------------------",fileUri)
//        console.log("number------------------------",mobilenum);
//        // Optionally, show a success message or perform another action after insertion
//     } catch (error) {
//        console.error('Error inserting image:', error);
//        // Optionally, show an error message
//     }
//    };
   
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Registration Page</Text>
//       <TextInput
//         variant="outlined"
//         label="Mobile Number"
//         value={mobilenum}
//         onChangeText={setMobilenum}
//       />
//       <Button
//         style={{ width: '50%', alignSelf: 'center', justifyContent: 'center' }}
//         title="Register"
//         onPress={launchCameraHandler}
//       />
//       {renderFileUri()}
//       <Button
//         style={{ width: '50%', alignSelf: 'center', justifyContent: 'center' }}
//         title="Add"
//         onPress={addtoDataBase}
//       />
//     </View>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({
//   body: {
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     borderColor: 'black',
//     borderWidth: 1,
//     height: Dimensions.get('screen').height - 20,
//     width: Dimensions.get('screen').width,
//   },
//   images: {
//     width: 250,
//     height: 250,
//     borderColor: 'black',
//     borderWidth: 1,
//     marginHorizontal: 3,
//   },
// });

import React from 'react'
import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform, TextInput } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import * as RNFS from 'react-native-fs'
import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit, RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api'
import { insertImage } from '../Database/Database'
interface IProps {
}

interface IState {
  img: any
  mobilenum: string
}
export default class FaceMatch extends React.Component<IProps, IState> {
  constructor(props: {} | Readonly<{}>) {
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
      img: require('../images/portrait.png'),
      mobilenum:''
    }
  }
  pickImage() {
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
          this.setImage(response.assets[0].base64!, Enum.ImageType.PRINTED)
        })
      },
      {
        text: "Use camera",
        onPress: () => FaceSDK.presentFaceCaptureActivity((json: string) => {
          var response = FaceCaptureResponse.fromJson(JSON.parse(json))!
          if (response.image != null && response.image.bitmap != null)
            this.setImage(response.image.bitmap, Enum.ImageType.LIVE)
          console.log(response.image?.bitmap)
            insertImage({uri:response.image?.bitmap,number:this.state.mobilenum})
        }, _e => { })
      }], { cancelable: true })
  }

  setImage(base64: string, type: number) {
    if (base64 == null) return
      this.setState({ img: { uri: "data:image/png;base64," + base64 } })
      console.log(this.state.img);
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>

        <View style={{ padding: 15 }}>
        <TextInput
          variant="outlined"
          label="Mobile Number"
          value={this.state.mobilenum}
          onChangeText={(text) => this.setState({ mobilenum: text })}
          />
          <TouchableOpacity onPress={() => this.pickImage()} style={{ alignItems: "center" }}>
            {/* <Text>{this.state.img1}</Text> */}
            <Image source={this.state.img} resizeMode="contain" style={{ height: 150, width: 150 }} />
          </TouchableOpacity>

        </View>
        </SafeAreaView>
        )
}
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
