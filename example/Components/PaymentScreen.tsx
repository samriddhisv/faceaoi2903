import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import OneUpi from 'one-react-native-upi';

const PaymentScreen = ({ route }) => {
 const { upiId } = route.params;
 const [amount, setAmount] = useState('');
 const [note, setNote] = useState('');

 const config = {
    upiId,
    name: 'Samriddhi', // Assuming this is the Paying Name
    note, // Use the state for the Note
    amount,
    // targetPackage: "in.org.npci.upiapp", // Uncomment this line if you want to target a specific UPI app
 };

 const onSuccess = (success) => {
    console.log({ success });
    // Handle success response here
 };

 const onFailure = (error) => {
    console.log({ error });
    // Handle failure response here
 };

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Paying Name: Samriddhi</Text>
      <Text style={styles.title}>Banking Name: Your Bank</Text>
      <Text style={styles.title}>UPI ID: {upiId}</Text>
      <Text style={styles.label}>Enter Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter Amount"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Note:</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Enter Note"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          OneUpi.initiate(
            config,
            onSuccess,
            onFailure,
          )
        }
      >
        <Text style={styles.buttonText}>{`Pay ${amount}`}</Text>
      </TouchableOpacity>
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5', // Light background
 },
 title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Dark text for titles
 },
 label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666', // Lighter text for labels
 },
 input: {
    height: 40,
    borderColor: '#CCC', // Lighter border
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5, // Rounded corners
    backgroundColor: '#FFF', // White background
 },
 button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 25, // Rounded corners for a more modern look
    marginTop: 20,
    alignItems: 'center',
    width: '100%', // Full width button
 },
 buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold', // Bold text for the button
 },
});

export default PaymentScreen;
