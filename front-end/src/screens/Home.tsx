import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Home({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo, Organizador!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Scanner")}>
        <Text style={styles.buttonText}>Validar Ingresso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.profileButton]} onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  welcome: {
    fontSize: 22,
    marginBottom: 40,
    fontWeight: "600"
  },
  button: {
    backgroundColor: "#4a66e6",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: 200
  },
  profileButton: {
    backgroundColor: "#555"
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
});
