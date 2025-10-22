import React, { useState } from "react";
import { 
  View, 
  Text, 
  Alert, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  Switch,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { getToken } from "../utils/storage";


export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [stats, setStats] = useState({
    total: 1000,
    verified: 450,
    remaining: 550
  });

  const openScanner = async () => {
    // Se já tem permissão, abre direto
    if (permission?.granted) {
      setScannerVisible(true);
      return;
    }

    // Se não tem permissão, solicita
    const result = await requestPermission();
    if (result.granted) {
      setScannerVisible(true);
    } else {
      Alert.alert(
        "Permissão Negada",
        "Para escanear ingressos, é necessário permitir o acesso à câmera.",
        [{ text: "OK" }]
      );
    }
  };

  const closeScanner = () => {
    setScannerVisible(false);
    setScanned(false);
  };

  const handleBarCodeScanned = async ({ data }: any) => {
    if (scanned || isLoading) return;
    
    setScanned(true);
    setIsLoading(true);

    try {
      const token = await getToken();
      const res = await api.post(
        "/ingressos/validate",
        { code: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.valid) {
        Alert.alert("✅ Ingresso válido", res.data.message || "");
        setStats(prev => ({
          ...prev,
          verified: prev.verified + 1,
          remaining: prev.remaining - 1
        }));
      } else {
        Alert.alert("❌ Ingresso inválido", res.data.message || "Erro");
      }
    } catch (error: any) {
      Alert.alert(
        "Erro", 
        error.response?.data?.message || "Falha na validação"
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setScanned(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
        translucent={false}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eventName}>Festa do Vibe Studio</Text>
        <Text style={styles.eventInfo}>Arena Vibe • 25/12/2024 • 22:00</Text>
        <Text style={styles.status}>🟢 Operação ativa</Text>
      </View>

      {/* Métricas */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, styles.verifiedCard]}>
          <Text style={[styles.statNumber, styles.verifiedNumber]}>{stats.verified}</Text>
          <Text style={styles.statLabel}>Verificados</Text>
        </View>
        <View style={[styles.statCard, styles.remainingCard]}>
          <Text style={[styles.statNumber, styles.remainingNumber]}>{stats.remaining}</Text>
          <Text style={styles.statLabel}>Restantes</Text>
        </View>
      </View>

      {/* Botão Principal - Scanner */}
      <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
        <Ionicons name="camera" size={32} color="#FFF" />
        <Text style={styles.scanButtonText}>Escanear Ingresso</Text>
        <Text style={styles.scanButtonSubtext}>Toque para abrir a câmera</Text>
      </TouchableOpacity>

      {/* Ações Rápidas */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="keypad" size={24} color="#0066FF" />
          <Text style={styles.actionText}>Digitar Código</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pause" size={24} color="#FF9500" />
          <Text style={styles.actionText}>Pausar Entrada</Text>
        </TouchableOpacity>
      </View>

      {/* Modal do Scanner */}
      <Modal
        visible={scannerVisible}
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          
          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeScanner}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Escanear Ingresso</Text>
            
            {/* Controle do Flash */}
            <View style={styles.flashControl}>
              <Ionicons 
                name={flashEnabled ? "flash" : "flash-off"} 
                size={24} 
                color="#FFF" 
              />
              <Switch
                value={flashEnabled}
                onValueChange={setFlashEnabled}
                trackColor={{ false: "#767577", true: "#0066FF" }}
              />
            </View>
          </View>

          {/* Área da Câmera */}
          {permission?.granted && (
            <View style={styles.cameraContainer}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417", "ean13", "code128"],
                }}
                flash={flashEnabled ? "on" : "off"}
              />
              
              {/* Overlay do Scanner */}
              <View style={styles.overlay}>
                <View style={styles.scanFrame} />
                <Text style={styles.scanText}>Posicione o QR Code na área</Text>
                
                {isLoading && (
                  <View style={styles.loadingOverlay}>
                    <Text style={styles.loadingText}>Validando ingresso...</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Botão Manual */}
          <TouchableOpacity style={styles.manualButton}>
            <Text style={styles.manualButtonText}>Digitar Código Manualmente</Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  verifiedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  remainingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  verifiedNumber: {
    color: '#4CAF50',
  },
  remainingNumber: {
    color: '#FF9800',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scanButton: {
    backgroundColor: '#0066FF',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  scanButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#000',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flashControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  manualButton: {
    backgroundColor: '#333',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});