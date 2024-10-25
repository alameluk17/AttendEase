import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'
import { Client, Functions, ExecutionMethod } from "appwrite"

async function getMoodleToken(moodleBaseURL: string, username: string, password: string): Promise<string> {
  try {
      // Check for missing parameters
      if (!moodleBaseURL || !username || !password) {
          throw new Error("Missing required parameters: moodleBaseURL, username, or password.");
      }

      // Setup headers
      let headersList = {
          "Accept": "*/*",
          "User-Agent": "AttendEase (https://github.com/alameluk17/AttendEase)"
      };
      
      // Create the form data
      let bodyContent = new FormData();
      bodyContent.append("username", username);
      bodyContent.append("password", password);
      bodyContent.append("service", "moodle_mobile_app");

      // Make the POST request
      let response = await fetch(`${moodleBaseURL}/login/token.php`, {
          method: "POST",
          body: bodyContent,
          headers: headersList
      });

      // Handle non-2xx HTTP status codes
      if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
      }

      // Parse response as JSON
      let data = await response.json();

      // Handle cases where token is not provided
      if (!data.token) {
          if (data.error) {
              throw new Error(`Moodle error: ${data.error}`);
          }
          throw new Error("Unexpected response: Token not found.");
      }

      // Return the token if all is well
      return data.token;

  } catch (error) {
      // Log the error and rethrow it for higher-level handling
      console.error("Error in getMoodleToken:", error);
      throw error;  // This can be handled by the caller
  }
}

const Login = ({navigation}: {navigation: any})=>{
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPasswordShown, setIsPasswordShown] = useState(true);

  const handleLogin = async () => {
    try {
      let token = await getMoodleToken("https://lms.ssn.edu.in", email, password);
      console.log("1")

      await textAppWriteAPI()
      console.log("2")
      setErrorMessage(null)
      await SecureStore.setItemAsync('currentMoken', token);
      // console.log("Token:", token);
    } catch (error: any) {
      setErrorMessage(error.message)
      console.error("Login failed:", error.message);
    }
  };

  const textAppWriteAPI = async () =>{ 
    const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('attendease'); // Your project ID

    const functions = new Functions(client);

    const body = {moken : 'abcd'}

    // try {
    //   const result= await functions.createExecution(
    //     'getAppwriteToken', // functionId
    //     JSON.stringify(body), // body (optional)
    //     true, // async (optional)
    //     '/', // path (optional)
    //     ExecutionMethod.POST, // method (optional)
    //     {}, //headers (optional)
    //   );
    //   console.log("Result: ", result['$id']);
    //   const res = await functions.getExecution(
    //     'getAppWriteToken', // functionId
    //     result['$id'] // executionId
    //   );
    //   console.log(res)
    
    // }catch(error){
    //   console.log(error)
    // }

    // try{
    //   const result = await fetch('https://671b42ca91a9506b72d5.appwrite.global/', {
    //   method: 'POST',
    //   body: JSON.stringify(body)
    //   })
    //   console.log(await result.json())
    // }catch(error){
    //   console.log(error)
    // }

     try{
      const result = await fetch('https://671b5d59cae31d6fd0ef.appwrite.global', {
      method: 'POST',
      body: JSON.stringify(body)
      })
      console.log(await result.json())
    }catch(error){
      console.log(error)
    }

  }

  return (
    <View style={styles.container}>
       <View style={styles.header}>
                <TouchableOpacity
                onPress={() => navigation.goBack()}
                style = {{paddingTop: 8}}
                >
                <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Log In</Text>
        </View>
      <View style={styles.inputSection}>
          <Text style={styles.label}>Email</Text>
          <TextInput
          placeholder="Enter Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          />
          <Text style={styles.label}>Password</Text>
          <View>
              <TextInput
              placeholder="Enter Password"
              secureTextEntry={isPasswordShown}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              />
              <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={{
                      position: "absolute",
                      right: 15,
                      top:12
                  }}
              >
                  {
                      isPasswordShown == true ? (
                          <Ionicons name="eye-off" size={24} color="#000" />
                      ) : (
                          <Ionicons name="eye" size={24} color="#000" />
                      )
                  }

              </TouchableOpacity>
            </View>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
       </View>
       <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                    style={styles.button}
                    onPress = {handleLogin}
                    >
                    <Text style={{ fontSize: 18, ... { color: '#FFFFFF' } }}>Log In</Text>
                </TouchableOpacity>
        </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    paddingHorizontal: 10,
    // paddingBottom: 20,
    flex: 1
  },
  header: {
    paddingHorizontal: 10, 
    // flexDirection: 'row',
    paddingVertical: 20
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingLeft: 8,
    color: '#0064B4',
    paddingTop: 16
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30
  },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10
  },
  label:{
      fontSize: 16,
      paddingBottom: 10,
      paddingLeft: 2,
      paddingTop: 30
  },
  errorText:{
      color: "red",
      paddingVertical: 20
  },
  button:{
      backgroundColor: '#000',
      paddingVertical: 17,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: '5%', 
      right: '5%'
      // bottom: 50,   
  }
});
