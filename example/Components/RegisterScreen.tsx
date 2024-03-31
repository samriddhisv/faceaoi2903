// import React from 'react'
// import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform} from 'react-native'
// import { RadioButton } from 'react-native-paper'
// import { launchImageLibrary } from 'react-native-image-picker'
// import {TextInput} from '@react-native-material/core'
// import * as RNFS from 'react-native-fs'
// import FaceSDK, { Enum, FaceCaptureResponse,  RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api'
// import { insertImage } from '../Database/Database'
// import axios from 'axios'
// interface IProps {
//   navigation?: any;
// }

// interface IState {
//   img: any
//   mobilenum: string
//   emailid:string
//   checked:string
//   registrationSuccessful:boolean
//   upiId: string
// }
// export default class Register extends React.Component<IProps, IState> {
 
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
//       img: require('../images/portrait.png'),
//       mobilenum:'',
//       emailid:'',
//       checked:'',
//       registrationSuccessful:false,
//       upiId:'',
//     }
//   }
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
//         'X-RapidAPI-Key': 'da304a728dmsha42a601d716ee33p1b3b58jsna789b3ed7c90', // Set your API key here
//         'X-RapidAPI-Host': 'upi-verification.p.rapidapi.com'
//       };

//       try {
//         const response = await axios.post(url, payload, { headers });
//         console.log(response.data);

//         if (response.data.result && response.data.result.status === 'id_found') {
//           const upiId = response.data.result.vpa;
//           this.setState({ upiId });
          
         
//           break; // Exit the loop
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
    
//  };
//  pickImage() {
//   Alert.alert("Select option", "", [
//      {
//        text: "Use gallery",
//        onPress: () => launchImageLibrary({
//          mediaType: 'photo',
//          selectionLimit: 1,
//          includeBase64: true
//        }, (response: any) => {
//          if (response.assets == undefined) return;
//          this.setImage(response.assets[0].base64!, Enum.ImageType.PRINTED);
//          // Log the image URI, mobile number, and UPI ID before calling insertImage
//          console.log("Image URI:", this.state.img.uri);
//          console.log("Mobile Number:", this.state.mobilenum);
//          console.log("UPI ID:", this.state.upiId);
//          // Ensure the URI is correctly set and passed
//         //  const imageUri = this.state.img.uri;
//          // Use the correct parameter names as expected by the insertImage function
//         //  insertImage({ uri: imageUri, number: this.state.mobilenum || this.state.emailid, upiId: this.state.upiId })
//         //    .then(() => {
//         //      console.log('Image inserted successfully');
//         //    })
//         //    .catch(error => {
//         //      console.error('Error inserting image:', error);
//         //      Alert.alert('Error', 'Failed to register. Please try again.');
//         //    });
//        })
//      },
//      {
//        text: "Use camera",
//        onPress: () => FaceSDK.presentFaceCaptureActivity((json: string) => {
//          var response = FaceCaptureResponse.fromJson(JSON.parse(json))!;
//          if (response.image != null && response.image.bitmap != null) {
//            this.setImage(response.image.bitmap, Enum.ImageType.LIVE);
//            // Log the image URI, mobile number, and UPI ID before calling insertImage
//            console.log("Image URI:", this.state.img.uri);
//            console.log("Mobile Number:", this.state.mobilenum);
//            console.log("UPI ID:", this.state.upiId);
//            // Ensure the URI is correctly set and passed
//           //  const imageUri = this.state.img.uri;
//           //  // Use the correct parameter names as expected by the insertImage function
//           //  insertImage({ uri: imageUri, number: this.state.mobilenum || this.state.emailid, upiId: this.state.upiId })
//           //    .then(() => {
//           //      console.log('Image inserted successfully');
//           //    })
//           //    .catch(error => {
//           //      console.error('Error inserting image:', error);
//           //      Alert.alert('Error', 'Failed to register. Please try again.');
//           //    });
//          }
//        }, _e => { })
//      }
//   ], { cancelable: true });
//  }
 
//   setImage(base64: string, type: number) {
//     if (base64 == null) return
//       this.setState({ img: { uri: "data:image/png;base64," + base64 } })
     
     
//       // console.log(this.state.img);
//   }
//   validateAndSubmit = async () => {
//     if (this.state.checked === '') {
//       Alert.alert('Please select an option');
//       return;
//     }
//     if (this.state.checked === 'first' && this.state.emailid === '') {
//       Alert.alert('Please enter your email ID');
//       // this.fetchUpiId(this.state.emailid);
//       // console.log('calling fetchUpiId for email');
//       return;
//     }
//     if (this.state.checked === 'second' && this.state.mobilenum === '') {
//       Alert.alert('Please enter your mobile number');
//       // await this.fetchUpiId(this.state.mobilenum);
//       // console.log('calling fetchUpiId for mobile');
//       return;
//     }
//     if (this.state.img === require('../images/portrait.png')) {
//       Alert.alert('Please capture face or select an image');
//       return;
//     }
//     console.log("Attempting to insert image details:", { uri: this.state.img.uri, number: this.state.mobilenum || this.state.emailid, upiId: this.state.upiId });
//     if (this.state.checked === 'first') {
//       console.log('Fetching UPI ID for email:', this.state.emailid);
//       await this.fetchUpiId(this.state.emailid);
//    } else if (this.state.checked === 'second') {
//       console.log('Fetching UPI ID for mobile number:', this.state.mobilenum);
//       await this.fetchUpiId(this.state.mobilenum);
//    }
//     insertImage({ uri: this.state.img.uri, number: this.state.mobilenum || this.state.emailid, upiId: this.state.upiId })
//       .then(() => {
//         console.log('Image details inserted successfully');
//         this.setState({ registrationSuccessful: true });
//       })
//       .catch(error => {
//         console.error('Error inserting image details:', error);
//         Alert.alert('Error', 'Failed to register. Please try again.');
//       });
//     this.setState({ registrationSuccessful: true });


//  };
// render() {
//   // Check if registration is successful
//   if (this.state.registrationSuccessful) {
//      return (
//        <SafeAreaView style={styles.success}>
//         <Image source={require('../images/tick.png')} style={{ height: 50, width: 50,alignSelf:'center',padding:5}} />
//          <Text style={{ fontSize: 24, color: '#0096FF',padding:10 }}>Registration Successful</Text>
//          <Button title="Home" color="#0096FF" onPress={() => this.props.navigation.navigate('Home')} />
//        </SafeAreaView>
//      );
//   } else {
//      return (
//        <SafeAreaView style={styles.container}>
//          <Text>Are you a Google Pay User</Text>
//          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
//            <RadioButton
//              value="first"
//              color='#0096FF'
//              status={this.state.checked === 'first' ? 'checked' : 'unchecked'}
//              onPress={() => this.setState({ checked: 'first' })}
//            />
//            <Text>Yes</Text>
//          </View>
//          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//            <RadioButton
//              value="second"
//              color='#0096FF'
//              status={this.state.checked === 'second' ? 'checked' : 'unchecked'}
//              onPress={() => this.setState({ checked: 'second' })}
//            />
//            <Text>No</Text>
//          </View>
//          {this.state.checked === 'first' && (
//            <TextInput variant="outlined" label="Please enter your mail id"  
//              value={this.state.emailid} 
//              onChangeText={text => this.setState({ emailid: text })}
//              color="#0096FF" style={{ margin: 16 }} />
//          )}
//          {this.state.checked === 'second' && (
//            <TextInput variant="outlined" label="Please enter your mobile number"  
//              value={this.state.mobilenum} 
//              onChangeText={text => this.setState({ mobilenum: text })}
//              color="#0096FF" style={{ margin: 0 }} />
//          )}
//         <TouchableOpacity 
//  onPress={async () => {
//     // Fetch UPI ID based on the selected option and the entered email ID or mobile number
//     // if (this.state.checked === 'first') {
//     //   console.log('Fetching UPI ID for email:', this.state.emailid);
//     //   await this.fetchUpiId(this.state.emailid);
//     // } else if (this.state.checked === 'second') {
//     //   console.log('Fetching UPI ID for mobile number:', this.state.mobilenum);
//     //   await this.fetchUpiId(this.state.mobilenum);
//     // }
//     // After fetching UPI ID, proceed with picking the image
//     this.pickImage();
//  }} 
//  style={{ alignItems: "center", padding: 20 }}
// >
//            <Image source={this.state.img} resizeMode="contain" style={{ height: 75, width: 75 }} />
//          </TouchableOpacity>
//          <Button title="Register" color="#0096FF" onPress={this.validateAndSubmit} />
//        </SafeAreaView>
//      );
//   }
//  }
 
// }
// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     height: '100%',
//     flex: 1,
//     padding:50,
//     justifyContent:'center',
 
//     backgroundColor: 'white',
//     marginBottom: 12,
//   },
//   success:{
//     width: '100%',
//     height: '100%',
//     flex: 1,
//     padding:50,
//     justifyContent:'center',
//     alignItems:'center',
//     backgroundColor: 'white',
//     marginBottom: 12,
//   }
// });

import React from 'react'
import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform, ActivityIndicator} from 'react-native'
import { RadioButton } from 'react-native-paper'
import { launchImageLibrary } from 'react-native-image-picker'
import {TextInput} from '@react-native-material/core'
import * as RNFS from 'react-native-fs'
import FaceSDK, { Enum, FaceCaptureResponse,  RNFaceApi, LivenessNotification, VideoEncoderCompletion, InitializationConfiguration } from '@regulaforensics/react-native-face-api'
import { insertImage } from '../Database/Database'
import uuid from 'react-native-uuid';
import axios from 'axios';

interface IProps {
  navigation?: any;
}

interface IState {
  img: any
  mobilenum: string
  emailid:string
  checked:string
  registrationSuccessful:boolean
  upiId:string
  imguri:string
  isLoading:boolean
}
export default class Register extends React.Component<IProps, IState> {
 
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
      mobilenum:'',
      emailid:'',
      checked:'',
      registrationSuccessful:false,
      upiId:'',
      imguri:'',
      isLoading:false
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
          this.setState({imguri: response.assets[0].uri!})
        })
      },
      {
        text: "Use camera",
        onPress: () => FaceSDK.presentFaceCaptureActivity((json: string) => {
          var response = FaceCaptureResponse.fromJson(JSON.parse(json))!
          if (response.image != null && response.image.bitmap != null)
            this.setImage(response.image.bitmap, Enum.ImageType.LIVE)
          console.log(response.image?.bitmap)
          this.setState({imguri:response.image?.bitmap!})
        }, _e => { })
      }], { cancelable: true })
  }

  setImage(base64: string, type: number) {
    if (base64 == null) return
      this.setState({ img: { uri: "data:image/png;base64," + base64 } })
      console.log(this.state.img);
  }
  fetchUpiIdforGpay = async (email: string) => {
    const cleanedString = this.removeExtraSpaces(email);
    this.setState({ isLoading: true });
    const upiExtensions = ["okhdfcbank","okicici","oksbi","okaxis"];
    let vpa = cleanedString.split('@')[0];
    console.log("callingggggggg==================================================================", vpa);
    let validUpiFound = false; // Flag to track if a valid UPI ID is found

    for (const extension of upiExtensions) {
       const fullVpa = `${vpa}@${extension}`;
       const url = 'https://upi-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_vpa';
   
       const payload = {
         task_id: uuid.v4(),
         group_id: uuid.v4(),
         data: { vpa: fullVpa }
       };
   
       const headers = {
         'content-type': 'application/json',
         'X-RapidAPI-Key': 'ad04695896mshdf4a605479cb9b5p1c4010jsnc47de7bce97c',
         'X-RapidAPI-Host': 'upi-verification.p.rapidapi.com'
       };
   
       try {
         const response = await axios.post(url, payload, { headers });
         console.log(response.data);
   
         if (response.data.result && response.data.result.status === 'id_found') {
           console.log("hi------------------------------------------------------------------------", response.data.result);
           this.setState({ upiId: response.data.result.vpa });
           console.log("Details before insertImage:", { upi: this.state.upiId});
           insertImage({ uri: this.state.imguri, number: this.state.emailid, upi: response.data.result.vpa })
             .then(result => {
               console.log('Insertion result:', result);
               this.setState({ isLoading: false});
             })
             .catch(error => {
               console.error('Error inserting image:', error);
               Alert.alert('Error', 'Failed to register. Please try again.');
               this.setState({ isLoading: false});
             });
   
           validUpiFound = true; // Set the flag to true since a valid UPI ID was found
           break; // Exit the loop
         }
       } catch (error) {
         console.error(error);
         // Handle the error appropriately
       }
    }

    // Check if a valid UPI ID was found after the loop
    if (!validUpiFound) {
      console.log("No valid UPI ID found.");
      Alert.alert('Error', 'No valid UPI ID found for the provided email. Please try again.');
      this.setState({ isLoading: false });
    }
};

   
  fetchUpiId = async (phoneNumber: string) => {
    this.setState({ isLoading: true});
    const upiExtensions = ["axl", "ibl","ybl","paytm"];
    let vpa = phoneNumber;
    let validUpiFound = false;

    for (const extension of upiExtensions) {
      const fullVpa = `${vpa}@${extension}`;
      const url = 'https://upi-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_vpa';

      const payload = {
        task_id: uuid.v4(), // You should generate a UUID for task_id and group_id
        group_id: uuid.v4(),
        data: { vpa: fullVpa }
      };

      const headers = {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'ad04695896mshdf4a605479cb9b5p1c4010jsnc47de7bce97c', // Set your API key here
        'X-RapidAPI-Host': 'upi-verification.p.rapidapi.com'
      };

      try {
        const response = await axios.post(url, payload, { headers });
        console.log(response.data);
        if (response.data.result && response.data.result.status === 'id_found') {
          console.log("hi------------------------------------------------------------------------", response.data.result);
          this.setState({ upiId: response.data.result.vpa });
          console.log("Details before insertImage:", { upi: this.state.upiId});
          insertImage({ uri: this.state.imguri, number: this.state.emailid, upi: response.data.result.vpa })
            .then(result => {
              console.log('Insertion result:', result);
              this.setState({ isLoading: false});
            })
            .catch(error => {
              console.error('Error inserting image:', error);
              Alert.alert('Error', 'Failed to register. Please try again.');
              this.setState({ isLoading: false});
            });
            validUpiFound = true; 
          break; // Exit the loop
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (!validUpiFound) {
      console.log("No valid UPI ID found.");
      Alert.alert('Error', 'No valid UPI ID found for the provided email. Please try again.');
      this.setState({ isLoading: false });
    }
    
 };
 removeExtraSpaces = (str) => {
  return str.replace(/\s+/g, ' ').trim();
 };
 validateEmail = (email) => {
  // More permissive regex for email validation
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
 };
 

 // Function to validate the mobile number
 validateMobileNumber = (number) => {
    // Regular expression for a 10-digit number
    const regex = /^\d{10}$/;
    return regex.test(number);
 };
  validateAndSubmit = async() => {
    console.log(this.state.emailid);
    //if a google pay user============================================================================
    if (this.state.checked === '') {
       Alert.alert('Please select an option');
       return;
    }
    if (this.state.checked === 'first' ) {
      if(this.state.emailid === ''){
       Alert.alert('Please enter your email ID');
       return;
      }
      else if(!this.validateEmail(this.state.emailid)){
        Alert.alert("Invalid Email Id");return;
      }
      else {
        this.fetchUpiIdforGpay(this.state.emailid)
        .then(() => {
          this.setState({ registrationSuccessful: true });
        })
        .catch(error => {
          console.error('Failed to fetch UPI ID:', error);
          Alert.alert('Error', 'Failed to fetch UPI ID. Please try again.');
        });
      }
    }
    //if not a google pay user=====================================================================================
    if (this.state.checked === 'second') {
      if(this.state.mobilenum=== ''){
       Alert.alert('Please enter your mobile number');
       return;
    }
    else if(!this.validateMobileNumber(this.state.mobilenum)){
      Alert.alert("Invalid Mobile Number");return;
    }
    else{
      this.fetchUpiId(this.state.mobilenum)
        .then(() => {
          this.setState({ registrationSuccessful: true });
        })
        .catch(error => {
          console.error('Failed to fetch UPI ID:', error);
          Alert.alert('Error', 'Failed to fetch UPI ID. Please try again.');
        });
    }
  }
    if (this.state.img === require('../images/portrait.png')) {
       Alert.alert('Please capture face or select an image');
       return;
    }


   };
   
render() {
  // Check if registration is successful
  if (this.state.registrationSuccessful) {
     return (
       <SafeAreaView style={styles.success}>
        <Image source={require('../images/tick.png')} style={{ height: 50, width: 50,alignSelf:'center',padding:5}} />
         <Text style={{ fontSize: 24, color: '#0096FF',padding:10 }}>Registration Successful</Text>
         <Button title="Home" color="#0096FF" onPress={() => this.props.navigation.navigate('Home')} />
       </SafeAreaView>
     );
  }
  if (this.state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0096FF" />
      </SafeAreaView>
    );
 } else {
  
     return (
       <SafeAreaView style={styles.container}>
         {this.state.isLoading && (
          <ActivityIndicator size="large" color="#0096FF" />
        )}
         <Text>Are you a Google Pay User</Text>
         <View style={{ flexDirection: 'row', alignItems: 'center', }}>
           <RadioButton
             value="first"
             color='#0096FF'
             status={this.state.checked === 'first' ? 'checked' : 'unchecked'}
             onPress={() => this.setState({ checked: 'first' })}
           />
           <Text>Yes</Text>
         </View>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <RadioButton
             value="second"
             color='#0096FF'
             status={this.state.checked === 'second' ? 'checked' : 'unchecked'}
             onPress={() => this.setState({ checked: 'second' })}
           />
           <Text>No</Text>
         </View>
         {this.state.checked === 'first' && (
           <TextInput variant="outlined" label="Please enter your mail id"  
             value={this.state.emailid} 
             onChangeText={(text) => {
              this.setState({ emailid: text }, () => {
                 console.log("Updated email ID:", this.state.emailid);
              });
             }}
             
             color="#0096FF" style={{ margin: 16 }} />
         )}
         {this.state.checked === 'second' && (
           <TextInput variant="outlined" label="Please enter your mobile number"  
             value={this.state.mobilenum} 
             onChangeText={text => this.setState({ mobilenum: text })}
             color="#0096FF" style={{ margin: 16 }} />
         )}
         <TouchableOpacity onPress={() => this.pickImage()} style={{ alignItems: "center", padding: 20 }}>
           <Image source={this.state.img} resizeMode="contain" style={{ height: 75, width: 75 }} />
         </TouchableOpacity>
         <Button title="Register" color="#0096FF" onPress={this.validateAndSubmit} />  
       </SafeAreaView>
     );
  }
 }
 
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    padding:50,
    justifyContent:'center',
 
    backgroundColor: 'white',
    marginBottom: 12,
  },
  success:{
    width: '100%',
    height: '100%',
    flex: 1,
    padding:50,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
    marginBottom: 12,
  }
});

