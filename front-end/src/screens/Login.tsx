import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import VibeStudio from "./../assets/svgs/vibeStudio";
import { saveUser } from "../utils/storage";
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = "http://:5000";
const { width, height } = Dimensions.get('window');

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    senha: false
  });

  useEffect(() => {
    const verificarLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      try {
        const resposta = await axios.get(`${API_BASE_URL}/api/users/check-auth`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resposta.data.user) {
          navigation.replace("MainTabs");
        }
      } catch (err: any) {
        console.log("Token inválido ou expirado:", err.message);
      }
    };
    verificarLogin();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, { email, senha });
      const { token, user } = response.data;

      if (!token || !user) throw new Error("Resposta de login inválida da API.");

      await saveUser(user, token);
      navigation.replace("Home");

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Ocorreu um erro ao fazer login.";
      Alert.alert("Erro de Login", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Topo azul com logo */}
        <View style={styles.topContainer}>
          <VibeStudio width={150} height={150} />
          <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
          <Text style={styles.welcomeSubtitle}>Faça login para continuar</Text>
        </View>

        {/* Formulário de login */}
        <View style={styles.bottomContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Login exclusivo para organizadores do evento</Text>

            {/* Inputs */}
            <View style={styles.inputWrapper}>
              <View style={[
                styles.inputContainer,
                isFocused.email && styles.inputContainerFocused
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={isFocused.email ? "#0969fb" : "#666"} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                />
              </View>

              <View style={[
                styles.inputContainer,
                isFocused.senha && styles.inputContainerFocused
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={isFocused.senha ? "#0969fb" : "#666"} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Senha"
                  placeholderTextColor="#999"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showPassword}
                  onFocus={() => handleFocus('senha')}
                  onBlur={() => handleBlur('senha')}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={22} 
                    color={isFocused.senha ? "#0969fb" : "#666"} 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Precisa de uma conta?{" "}
                  <Text style={styles.footerLink}>Acesse: vibeticket.com.br</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0969fb",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topContainer: {
    backgroundColor: "#0969fb",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 25,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#e6f0ff",
    marginTop: 10,
    textAlign: "center",
    opacity: 0.9,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -35,
    minHeight: height * 0.55,
  },
  formContainer: {
    flex: 1,
    padding: 32,
    paddingTop: 45,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 35,
    lineHeight: 22,
    fontWeight: "500",
  },
  inputWrapper: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: "#0969fb",
    backgroundColor: "#fff",
    shadowColor: "#0969fb",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    paddingLeft: 18,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 17,
    paddingRight: 15,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 17,
    paddingRight: 15,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
    marginTop: -5,
  },
  forgotPasswordText: {
    color: "#0969fb",
    fontSize: 15,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#0969fb",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    shadowColor: "#0969fb",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1 }],
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  footerLink: {
    color: "#0969fb",
    fontWeight: "600",
  },
});