import React, { useState } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { storageSingleton } from '../../storageSingleton';

export default function PseudoScreen() {
    const [username, setUsername] = useState("");

    const handleContinue = async () => {
        if (!username.trim()) {
            Alert.alert("Erreur", "Veuillez entrer un pseudo !");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/guest/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pseudo: username,
                }),
            });

            const data = await response.json();
            console.log("Réponse backend:", data);

            if (response.ok) {
                await storageSingleton.setItem("token", data.token);

                Alert.alert("Succès", "Pseudo enregistré !");
                router.push("/reservation/wishlist"); 
            } else {
                Alert.alert("Erreur", data.message || "Impossible d’ajouter le pseudo.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Problème de connexion au serveur.");
        }
    };


    return (
        <View style={styles.container}>
        {/* Désactive le header */}
        <Stack.Screen options={{ headerShown: false }} />
        {/* Logo */}
        <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
        />

        {/* Titre */}
        <Text style={styles.title}>Veuillez saisir votre pseudo</Text>

        {/* Input */}
        <TextInput
            style={styles.input}
            placeholder="Entrez votre pseudo"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
        />

        {/* Bouton continuer */}
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>CONTINUER</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
    },
    logo: {
        width: 250,
        height: 250,
        paddingTop:400
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#6C2DC7",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        width: "80%",
        height: 50,
        borderWidth: 2,
        borderColor: "#6C2DC7",
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 30,
        textAlign: "center",
        fontFamily: 'Poppins',
    },
    button: {
        width: "80%",
        height: 50,
        backgroundColor: "#6C2DC7",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});