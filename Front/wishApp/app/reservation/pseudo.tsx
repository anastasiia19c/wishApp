import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity, TextInput} from "react-native";
import { Stack, router } from "expo-router";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function PseudoScreen() {
    //const [username, setUsername] = useState("");

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
            //value={username}
            //onChangeText={setUsername}
        />

        {/* Bouton continuer */}
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
            // if (username.trim()) {
            //     router.push("/home"); // 🔹 redirige vers la page suivante
            // } else {
            //     alert("Veuillez entrer un pseudo !");
            // }
            }}
        >
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