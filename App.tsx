/**
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RemoteScreen } from './src/screens/RemoteScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <RemoteScreen />
    </SafeAreaProvider>
  );
}

export default App;
