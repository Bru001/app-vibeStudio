import React, { useState, useEffect } from "react";
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
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { saveUser } from "../utils/storage";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verificarLogin();
  }, []);

  const verificarLogin = async () => {
    const user = await AsyncStorage.getItem("usuario");
    if (user) navigation.replace("Home");
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/api/users/login", {
        email,
        password: senha
      });
      const { token, user } = response.data;
      await saveUser(user, token);
      navigation.replace("Home");
    } catch (err) {
      Alert.alert("Erro", "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={require("../../assets/icon.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>QR Tech</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

        <View>
          <TextInput style={styles.input} placeholder="Email" value={email}
            onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Senha" value={senha}
            secureTextEntry onChangeText={setSenha} />

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30
  },
  header: {
    alignItems: "center",
    marginBottom: 40
  },
  logo: {
    height: 150,
    width: 150,
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4a66e6"
  },
  subtitle: {
    fontSize: 16,
    color: "#666"
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4a66e6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
});
