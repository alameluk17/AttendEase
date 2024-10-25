import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Welcome = ({navigation}:{navigation:any}) => {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={require('../../attendease/assets/images/ssn.png')}
            style={styles.backgroundImage}
          />
          <LinearGradient
            colors={["transparent", "white"]}
            style={styles.fadeEffect}/>
        </View>
        <View style={styles.textContainer}>
        <Text style={styles.headerText}>Welcome to AttendEase,</Text>
        <Text style={styles.subHeaderText}>SSN's Own Attendance Tracker</Text>
        <Text style={styles.descriptionText}>
        Your streamlined attendance solution starts. 
        </Text>
        <Text  style={styles.descriptionText}>Keep up that 75%, y'all! :)</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Let's get started!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  export default Welcome;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageContainer: {
      height: '45%',
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    textContainer: {
      flex: 1,
      paddingHorizontal: 20, 
      backgroundColor: 'white'
    },
    headerText: {
      color: '#0064B0',
      fontSize: 32,
      fontWeight: 'bold',
    },
    subHeaderText: {
      color: '#000',
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    descriptionText: {
      color: '#666',
      fontSize: 18
    },
    button: {
    //   backgroundColor: '#0064B0',
      backgroundColor: '#000',
      paddingVertical: 17,
      paddingHorizontal: 30,
      borderRadius: 17,
      marginTop: 180
    //   marginHorizontal: 10
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center'
    },
    fadeEffect: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60%",
        justifyContent: "flex-end",
        padding: 10,
    }
  });
  