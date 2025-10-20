import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { clearStorage } from "../utils/storage";

export default function Perfil({ navigation }: any) {
    const logout = async () => {
        await clearStorage();
        Alert.alert("Sessão encerrada", "Você saiu do aplicativo.");
        navigation.replace("Login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 24,
        marginBottom: 20
    },
    button: {
        backgroundColor: "#4a66e6",
        padding: 15,
        borderRadius: 8,
        width: 150
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold"
    },
});
