import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import VibeStudio from "./../assets/svgs/vibeStudio";

export default function SplashScreen({ navigation }: any) {
  const [dots, setDots] = useState(0);

  // Animação
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev >= 3 ? 0 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setTimeout(() => {
        navigation.replace(token ? "MainTabs" : "Login");
      }, 2000);
    };
    checkLogin();
  }, [navigation]);

  const dotsDisplay = ".".repeat(dots) + " ".repeat(3 - dots);

  return (
    <View style={styles.container}>
      <VibeStudio width={350} height={200} />

      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando{dotsDisplay}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0969fb",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 45,
    right: 45,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});
