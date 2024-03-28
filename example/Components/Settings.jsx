import React ,{useState,useEffect}from 'react'
import { SafeAreaView, StyleSheet, View, Button, Text, Image, Alert, NativeEventEmitter, TouchableOpacity, Platform } from 'react-native';
import { deleteAllRows, getAllImages } from '../Database/Database';

export default function Settings() {
    const [imagesArray, setImagesArray] = useState([]);
    const fetchImagesFromDatabase = () => {
        getAllImages()
        .then(data => {
           const images = data
             .filter(item => item.uri && item.uri.trim() !== '') // Filter out images with empty URIs
             .map(item => ({
               uri: item.uri,
               number: item.number,
               upiId:item.upiId
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
    <View style={{alignItems:'center',flex:1,justifyContent:'center'}}>
    <View style={{ padding: 3, width: "60%"}}>
    <Button title="Delete rows" color="#4285F4" onPress={() => {deleteAllRows()}} />
 </View>
 <View style={{ padding: 3, width: "60%"}}>
    <Button title="View Database" color="#4285F4" onPress={() => {fetchImagesFromDatabase()}} />
    {imagesArray.map((image, index) => (
     <View key={index}>
         <Text>Number: {image.number}</Text>
         <Text>UPI ID: {image.upiId}</Text>
     </View>
     
     ))}

 </View>
 </View>
 </>
  )
}
