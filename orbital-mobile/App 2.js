import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [loading, setLoading] = useState(false);

  const fetchToken = async () => {
    setLoading(true);
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Notifications permission strictly required for push token.');
        setLoading(false);
        return;
      }

      let token;
      try {
        const tokenObj = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId ?? 'dummy-project-id-1234'
        });
        token = tokenObj.data;
      } catch (tokenErr) {
        console.warn('Expo Push Token failed, falling back to mock.', tokenErr);
        token = 'ExponentPushToken[mock_demo_token]';
      }
      
      console.log('🔥 EXPO TOKEN:', token);
      Alert.alert('YOUR TOKEN', token);
    } catch (error) {
      console.error('General Error:', error);
      Alert.alert('DEBUG ERROR', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>ORBITAL DEBUG</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={fetchToken}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000000" size="large" />
        ) : (
          <Text style={styles.buttonText}>GET PUSH TOKEN</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.subtext}>Inspect Terminal / Metro Logs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#7be1ea',
    fontSize: 28,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#ff4444',
    borderWidth: 2,
    borderColor: '#ff4444',
    paddingVertical: 20,
    paddingHorizontal: 40,
    shadowColor: '#ff4444',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 22,
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtext: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 40,
    letterSpacing: 3,
    textTransform: 'uppercase',
  }
});
