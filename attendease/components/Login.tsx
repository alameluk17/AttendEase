import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState } from 'react';

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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Add login logic here
    try {
      
      let token = await getMoodleToken("https://lms.ssn.edu.in", email, password);
      console.log("Token:", token);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
