import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import api from "../services/api";
import { getToken } from "../utils/storage";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Solicitar permissão se ainda não foi concedida
  useEffect(() => {
    if (permission && !permission.granted && !permission.canAskAgain) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à câmera para escanear os ingressos.",
        [{ text: "OK" }]
      );
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: any) => {
    setScanned(true);
    const token = await getToken();

    try {
      const res = await api.post(
        "/ingressos/validate",
        { code: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.valid) {
        Alert.alert("✅ Ingresso válido", res.data.message || "");
      } else {
        Alert.alert("❌ Ingresso inválido", res.data.message || "Erro");
      }
    } catch (error: any) {
      Alert.alert(
        "Erro", 
        error.response?.data?.message || "Falha na validação do ingresso"
      );
    } finally {
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (!permission) {
    return <Text>Carregando...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Precisamos de permissão para acessar a câmera
        </Text>
        <Text style={styles.button} onPress={requestPermission}>
          Conceder Permissão
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417", "ean13", "code128"],
        }}
      />
      
      {/* Overlay para ajudar no enquadramento */}
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.scanText}>Posicione o código QR dentro do quadro</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#00FF00",
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  scanText: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
  },
});