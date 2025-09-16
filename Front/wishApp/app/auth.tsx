import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
//import { storageSingleton } from '../storageSingleton'; // Import du singleton

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [nom, setNom] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null); // État local pour gérer le token
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
            <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            </View>

            <View style={styles.formContainer}>
            <Text style={styles.title}>Créer un compte</Text>
            <View style={styles.accountLinkContainer}>
                <TouchableOpacity onPress={() => router.replace('./')}>
                    <Text style={styles.creerCompte}>J'ai déjà un compte</Text>
                </TouchableOpacity>
            </View>

            {!token ? (
                <>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Nom*</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Alice Cooper"
                    placeholderTextColor="#A9A9A9"
                    value={nom}
                    onChangeText={setNom}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>E-mail*</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Email utilisateur"
                    placeholderTextColor="#A9A9A9"
                    value={email}
                    onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Mot de passe*</Text>
                    <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="Mot de passe"
                    placeholderTextColor="#A9A9A9"
                    value={password}
                    onChangeText={setPassword}
                    />
                </View>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>
                    {isLoading ? 'Chargement...' : 'Créer un compte'}
                    </Text>
                </TouchableOpacity>
                </>
            ) : (
                <>
                <Text style={styles.inputLabel}>Vous êtes déjà connecté.</Text>
                <TouchableOpacity style={styles.loginButton} >
                    <Text style={styles.loginButtonText}>Se déconnecter</Text>
                </TouchableOpacity>
                </>
            )}
            </View>
        </View>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    inputLabel: {
        fontSize: 15,
        color: '#000',
        marginBottom: 5,
        fontFamily: 'Poppins',
        borderRadius: 25,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    formContainer: {
        backgroundColor: '#fff',
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 25,
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        color: "#6C2DC7",
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontFamily: "Poppins",
    },
    forgotPassword: {
        color: '#000',
        fontSize: 15,
        marginBottom: 20,
        fontFamily: 'Poppins',
        textDecorationLine: 'underline',
        textDecorationColor: '#000',
    },
    creerCompte: {
        color: '#000',
        fontSize: 10,
        marginBottom: 5,
        marginLeft: 5,
        fontFamily: 'Poppins',
        textDecorationLine: 'underline',
        textDecorationColor: '#000',
    },
    loginButton: {
        backgroundColor: "#6C2DC7",
        width: '100%',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    loginButtonText: {
        fontFamily: 'Poppins',
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    accountLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: 'white',
    },
});