import React, { useState, useEffect } from 'react';
import {
  View,
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verificarLogin();
  }, []);

  const verificarLogin = async () => {
    const user = await AsyncStorage.getItem('usuario');
    if (user) {
      navigation.replace('Home');
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    // Simulando requisição assíncrona
    setTimeout(async () => {
      if (email === 'bruno@gmail.com' && senha === '123') {
        await AsyncStorage.setItem('usuario', JSON.stringify({ email }));
        navigation.replace('Home');
      } else {
        Alert.alert('Erro', 'Email ou senha inválidos');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>QR Tech</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={setSenha}
            value={senha}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    height: 150,
    width: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a66e6',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a66e6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#4a66e6',
    fontSize: 14,
  },
});