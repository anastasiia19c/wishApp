import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { storageSingleton } from '../storageSingleton'; // Import du singleton

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null); // État local pour gérer le token
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    useEffect(() => {
        const checkAuth = async () => {
            const token = await storageSingleton.getItem("token");
            if (token) {
                router.replace("/(tabs)/wishList");
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);


    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://10.6.0.2:3000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 201) {
                await storageSingleton.setItem("token", data.token); // sauvegarde du token
                await storageSingleton.setItem("role", data.role); // sauvegarde du role
                if (data.user && data.user.id) {
                    await storageSingleton.setItem("id", data.user.id);
                }
                setToken(data.token);
                router.push("/(tabs)/wishList"); // redirection vers la wishlist
            } else {
                setErrorMessage("Échec de la connexion.");
            }
        } catch (error) {
            setErrorMessage("Problème de connexion au serveur.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await storageSingleton.removeItem("token");
        await storageSingleton.removeItem("role");
        await storageSingleton.removeItem("guest_id");
        await storageSingleton.removeItem("user_id");
        setToken(null);
        setErrorMessage("Vous avez été déconnecté.");
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.sousTitle}>
                        Connectez-vous pour découvrir toutes nos fonctionnalités.
                    </Text>
                    {errorMessage && (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    )}
                    {!token ? (
                        <>
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

                            <TouchableOpacity>
                                <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>
                                    {isLoading ? "Chargement..." : "Se connecter"}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.accountLinkContainer}>
                                <TouchableOpacity onPress={() => router.replace('./auth')}>
                                    <Text style={styles.creerCompte}>Créer un compte</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={styles.inputLabel}>Vous êtes déjà connecté.</Text>
                            <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
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
        marginBottom: 20,
    },
    sousTitle: {
        fontFamily: 'Poppins',
        fontSize: 15,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
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
        fontSize: 10,
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
    errorText: {
        color: "red",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 10,
        textAlign: "center",
    }
});