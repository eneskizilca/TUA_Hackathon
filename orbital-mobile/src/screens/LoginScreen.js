import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import colors from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async () => {
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg('Lütfen tüm alanları doldurun.');
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await client.post('/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const token = response.data.token || response.data.access_token || response.data.access;
      if (token) {
        await AsyncStorage.setItem('token', token);
        navigation.replace('Dashboard');
      } else {
        setErrorMsg('Sunucudan token alınamadı.');
      }
    } catch (error) {
      console.error(error);
      const err = error.response?.data?.detail || error.response?.data?.message || 'Bağlantı hatası.';
      setErrorMsg(typeof err === 'string' ? err : JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/seffaf-orbital-logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
        <Text style={styles.title}>ORBITAL SENSE</Text>
        <Text style={styles.subtitle}>MISSION CONTROL ACCESS</Text>
      </View>

      <View style={styles.inputContainer}>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="EMAIL DIRECTIVE"
          placeholderTextColor={colors.secondaryText}
          value={email}
          onChangeText={(text) => { setEmail(text); setErrorMsg(null); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="SECURITY PASSWORD"
          placeholderTextColor={colors.secondaryText}
          value={password}
          onChangeText={(text) => { setPassword(text); setErrorMsg(null); }}
          secureTextEntry
        />
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {({ pressed }) => (
            loading ? (
              <ActivityIndicator color={pressed ? "#000000" : colors.primary} />
            ) : (
              <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
                INITIATE LOGIN
              </Text>
            )
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: colors.primary,
    fontSize: 34,
    fontFamily: colors.fontFamily,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 12,
    fontFamily: colors.fontFamily,
    letterSpacing: 4,
    marginTop: 8,
  },
  inputContainer: {
    width: '100%',
  },
  errorText: {
    color: colors.danger,
    fontFamily: colors.fontFamily,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: colors.primary,
    color: colors.primary,
    fontFamily: colors.fontFamily,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPressed: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: colors.fontFamily,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  buttonTextPressed: {
    color: '#000000',
  },
});
