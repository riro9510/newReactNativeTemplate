
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Navigation } from './navigation';

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riro's Customized Template</Text>
      <Text style={styles.subtitle}>Hello from your React Native Template 👋</Text>
      <Navigation />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding:30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center', 
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center', 
  },
});
export default App;  
