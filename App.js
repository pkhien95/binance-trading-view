import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Chart from './src/components/Chart';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Chart />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
