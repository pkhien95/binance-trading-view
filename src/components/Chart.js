import React from 'react';
import {Alert, StyleSheet, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import tradingViewJs from '../services/tradingview';

function Chart() {
  return (
    <WebView
      style={styles.webview}
      source={{
        uri:
          Platform.OS === 'ios'
            ? 'index.html'
            : 'file:///android_asset/index.html',
      }}
      allowFileAccessFromFileURLs={true}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      injectedJavaScript={tradingViewJs}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type == 'onIntervalChanged') {
          Alert.alert(
            'onIntervalChanged',
            'Interval = ' + data.interval,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: true},
          );
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  webview: {flex: 1},
});

export default Chart;
