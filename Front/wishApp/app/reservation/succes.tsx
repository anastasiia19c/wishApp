import { Image } from 'expo-image';
import { StyleSheet , View, Text} from 'react-native';
import { Stack } from "expo-router";

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
    }
});
