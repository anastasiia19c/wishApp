import { Image } from 'expo-image';
import { StyleSheet , View, Text, TouchableOpacity, } from 'react-native';
import { Stack, router } from "expo-router";

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
        <Text style={styles.title}>Avez-vous un compte?</Text>

        {/* Boutons */}
        <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => router.push("/reservation/login")} // Redirige vers la page de connexion
        >
            <Text style={styles.buttonPrimaryText}>Oui, je souhaite me connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.push("/reservation/pseudo")} // Redirige vers la page d'inscription
        >
            <Text style={styles.buttonSecondaryText}>Non, je n’ai pas de compte</Text>
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
