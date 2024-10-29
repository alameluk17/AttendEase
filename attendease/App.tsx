import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from './screens/WelcomeScreen'
import Login from './screens/Login';
import Courses from './screens/CoursesScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name = "Welcome"
          component = {Welcome}
          options={{ headerShown: false }}
          />
        <Stack.Screen
          name = "Login"
          component = {Login}
          options = {{headerShown: false}}
          />
        <Stack.Screen 
          name = "Courses"
          component={Courses}
          options={{headerShown: false}}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
