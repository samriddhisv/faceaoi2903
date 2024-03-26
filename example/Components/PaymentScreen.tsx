// PaymentScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import OneUpi from 'one-react-native-upi'; // Import OneUpi

const PaymentScreen = ({ route }) => {
 const { phoneNumber, upiId } = route.params;
 const [amount, setAmount] = useState('');

 const handlePayment = () => {
    if (!amount) {
      Alert.alert('Please enter the amount to pay.');
      return;
    }

    // UPI payment initiation configuration
    const config = {
      upiId,
      name: 'Your Payee Name', // Replace with the actual payee name
      note: 'Test payment',
      amount,
    };

    // Initiate UPI payment
    OneUpi.initiate(config, (success) => {
      console.log({ success });
      // Handle success response here
      Alert.alert('Payment Initiated', 'Your payment has been initiated.');
    }, (error) => {
      console.log({ error });
      // Handle failure response here
      Alert.alert('Payment Failed', 'There was an issue initiating your payment.');
    });
 };

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <Text style={styles.text}>UPI ID: {upiId}</Text>
      <Text style={styles.text}>Phone Number: {phoneNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        onChangeText={setAmount}
        value={amount}
      />
      <Button
        title="Pay Now"
        onPress={handlePayment}
        color="#4285F4" // Google's primary color
      />
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 20, // Add horizontal padding
 },
 title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
 },
 text: {
    fontSize: 18,
    marginBottom: 10,
 },
 input: {
    width: '100%', // Make the input field full width
    borderColor: '#D9D9D9', // Light grey border
    borderWidth: 1,
    borderRadius: 4, // Rounded corners
    padding: 10,
    marginBottom: 20,
 },
});

export default PaymentScreen;
