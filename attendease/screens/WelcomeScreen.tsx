import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
// import { authenticateUser } from '../components/authUtils';

const Welcome = ({navigation}:{navigation:any}) => {

    // Check if currentMoken is stored locally
    // If yes, send request to validateMoken with currentMoken
      // if the request sends the appwrite session token, validating the moken, redirect to CoursesPage
      // if the request sends an error it is likely the moken has expired, user is required to login again with their new password
    // If no, do nothing, user will login with their credentials
    useFocusEffect(
      React.useCallback(()=>{
        const authenticateUser  = async() =>{
          try {
              const currentMoken = await SecureStore.getItemAsync('currentMoken')
              if(currentMoken){
                const body = { moken: currentMoken }
                const response = await fetch('https://671b5d59cae31d6fd0ef.appwrite.global', {
                  method: 'POST',
                  body: JSON.stringify(body)
                })
                const result = await response.json()
                if(response.status === 200){
                  console.log(result)
                  navigation.navigate('Courses')
                } else if (response.status === 500){
                  console.log('moken expired or invalid, reset password and log in again')
                  await SecureStore.deleteItemAsync('currentMoken')
                  navigation.navigate('Login')
                }
              }
            }catch(error){
              console.log(error)
            }
        }
        authenticateUser()
      }, [])
    )

    


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
        Your streamlined attendance solution starts here. 
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
  