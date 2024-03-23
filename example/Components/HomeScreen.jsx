import React ,{useState,useEffect}from 'react'
import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform } from 'react-native';
import { deleteAllRows, getAllImages } from '../Database/Database';

export default function HomeScreen({navigation}) {
    const [imagesArray, setImagesArray] = useState([]);

    const fetchImagesFromDatabase = () => {
      getAllImages()
      .then(data => {
         const images = data
           .filter(item => item.uri && item.uri.trim() !== '') // Filter out images with empty URIs
           .map(item => ({
             uri: item.uri,
             number: item.number
           }));
         setImagesArray(images);
      })
      .catch(error => {
         console.error('Error fetching images from database:', error);
      });
     
    };
    useEffect(() => {
        fetchImagesFromDatabase(); // Fetch images from database when component mounts
      }, []);
  return (
     <>
    <View style={{ padding: 3, width: "60%" }}>
          <Button title="Demo" color="#4285F4" onPress={() => { navigation.navigate('facematch') }} />
       </View>
       <View style={{ padding: 3, width: "60%" }}>
       <Button title="Register" color="#4285F4" onPress={() => { navigation.navigate('register') }} />
    </View>
    <View style={{ padding: 3, width: "60%" }}>
       <Button title="Make Paymentssss" color="#4285F4" onPress={() => { navigation.navigate('makepayment') }} />
    </View>
    <View style={{ padding: 3, width: "60%" }}>
       <Button title="Delete rows" color="#4285F4" onPress={() => {deleteAllRows()}} />
    </View>
    <View style={{ padding: 3, width: "60%" }}>
       <Button title="View Database" color="#4285F4" onPress={() => {fetchImagesFromDatabase()}} />
       {imagesArray.map((image, index) => (
        <View key={index}>
            <Text>Number: {image.number}</Text>
            {/* {image.uri && image.uri.trim() !== '' && (
              <Image
                source={{ uri: image.uri }}
                style={{ width: 100, height: 100 }} // Adjust width and height as needed
              />
            )} */}
        </View>
        ))}

    </View>
    </>
  )
}
