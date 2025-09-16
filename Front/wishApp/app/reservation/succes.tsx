import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity, } from "react-native";
import { Stack, router } from "expo-router";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function EntranceScreen() {
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
        <Text style={styles.title}>Votre choix a été bien enregistré. Vous pouvez quitter la page</Text>
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
    buttonPrimary: {
        marginVertical: 10,
    },
    buttonPrimaryText: {
        fontSize: 16,
        color: "#6C2DC7",
        marginBottom: 20
    },
    buttonSecondary: {
        marginVertical: 10,
    },
    buttonSecondaryText: {
        fontSize: 16,
        color: "#6C2DC7",
        marginBottom: 20
    },
});
