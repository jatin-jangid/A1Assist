import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StatusBar } from 'react-native';
import FirebaseConnections from './src/components/FirebaseConnection';
import BottomTabs from './src/components/BottomTabs';


export default function App() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
