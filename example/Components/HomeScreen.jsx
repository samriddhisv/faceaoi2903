import React from 'react'
import { SafeAreaView, StyleSheet, View,Text, Image,  TouchableOpacity,  } from 'react-native';


export default function HomeScreen({navigation}) {
  return (
     <>
     <View style={{backgroundColor:'white'}}>
  <TouchableOpacity onPress={() => { navigation.navigate('Settings') }} style={{ alignItems: "flex-end", margin:10,backgroundColor:'white'}}>

    <Image source={require('../images/settings.png')} resizeMode="contain" style={{ height: 30, width: 30 }} />
  </TouchableOpacity>
  </View>

     <SafeAreaView style={styles.container}>

<View style={{ padding: 40 }}>
  <TouchableOpacity onPress={() => { navigation.navigate('Register') }} style={{ alignItems: "center" }}>
    <Image source={require('../images/register.png')} resizeMode="contain" style={{ height: 75, width: 75}} />
    <Text>Register</Text>
  </TouchableOpacity>
</View>

<View style={{ padding: 40 }}>
  <TouchableOpacity onPress={() => { navigation.navigate('Make Payment') }} style={{ alignItems: "center" }}>
    <Image source={require('../images/payment.png')} resizeMode="contain" style={{ height: 75, width: 75}} />
    <Text>Make Payment</Text>
  </TouchableOpacity>
</View>
</SafeAreaView>
    </> 
  )
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 12,
  },
});