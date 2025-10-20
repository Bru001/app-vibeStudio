import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet 
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem("usuario");
      setTimeout(() => {
        navigation.replace(user ? "Home" : "Login");
      }, 2000);
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>QR Tech</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0969fb",
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20
  },
});
