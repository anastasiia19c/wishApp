import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Image, Animated } from "react-native";
import { Stack } from "expo-router";
import { storageSingleton } from "../../storageSingleton";
import { ReservationStorage } from "../../service/reservationStorage";
import NetInfo from "@react-native-community/netinfo";
import { mergeReservations } from "../../service/mergeService";

export default function EntranceScreen() {
    const [id, setId] = useState<string | null>(null);
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastSync, setLastSync] = useState<string | null>(null);
    const [fadeAnim] = useState(new Animated.Value(1));

    const fetchReservation = async () => {
        try {
            const storedId = await storageSingleton.getItem("reservation_id");
            if (!storedId) {
                setError("Aucune réservation trouvée.");
                setLoading(false);
                return;
            }

            const token = await storageSingleton.getItem("token");
            const netState = await NetInfo.fetch();
            setId(storedId);

            // Mode hors ligne → lecture des données locales
            if (!netState.isConnected) {
                console.log("Hors ligne — lecture locale");
                const localReservations = await ReservationStorage.getAll();
                const local = localReservations.find(
                    (r) => r.id === storedId || !r.synced
                );
                if (local) {
                    setReservation(local);
                } else {
                    setError("Aucune donnée locale trouvée.");
                }
                setLoading(false);
                return;
            }


            // Mode en ligne → récupération depuis le serveur
            console.log("Connexion détectée — récupération serveur");
            const res = await fetch(`http://localhost:4000/reservation/${storedId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Erreur API");
            const serverData = await res.json();

            // Récupération de la version locale
            const localReservations = await ReservationStorage.getAll();
            const local = localReservations.find((r) => r.id === storedId);

            const lastSyncStr = await storageSingleton.getItem("last_sync");
            const lastSync = lastSyncStr ? new Date(lastSyncStr).getTime() : 0;

            // Fusion intelligente
            const merged = mergeReservations(local, serverData, lastSync);

            // Sauvegarde fusionnée dans le cache local
            await ReservationStorage.setAll([merged]);
            await storageSingleton.setItem("last_sync", new Date().toISOString());
            setReservation(merged);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger la réservation.");
        } finally {
            setLoading(false);
        }
    };

    // === Exécution initiale
    useEffect(() => {
        fetchReservation();
    }, []);
    // === Détection reconnexion (pour synchroniser)
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            if (state.isConnected) {
                console.log("Reconnexion — synchronisation complète");
                await fetchReservation(); // met à jour depuis le serveur (merge)
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const loadLastSync = async () => {
            const saved = await storageSingleton.getItem("last_sync");
            if (saved) {
                setLastSync(saved);

                // Lancer la disparition au bout de 5s
                setTimeout(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 600, // durée de l’animation
                        useNativeDriver: true,
                    }).start(() => setLastSync(null)); // supprime le message
                }, 5000);
            }
        };
        loadLastSync();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6C2DC7" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    if (!reservation) {
        return (
            <View style={styles.center}>
                <Text>Aucune réservation trouvée.</Text>
            </View>
        );
    }

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
            {/* Désactive le header */}
            <Stack.Screen options={{ headerShown: false }} />
            {lastSync && (
                <Animated.View style={[styles.syncBanner, { opacity: fadeAnim }]}>
                    <Text style={styles.syncText}>
                        🟢 Données mises à jour depuis le serveur{"\n"}
                        Dernière synchro : {lastSync}
                    </Text>
                </Animated.View>
            )}
            {/* Titre principal */}
            <Text style={styles.title}>Merci !</Text>
            <Text style={styles.subtitle}>
                Votre réservation a bien été enregistrée. Vous pouvez consulter les détails ci-dessous.
            </Text>

            {/* Détails de la wishlist */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>{reservation.wishlist_id?.title}</Text>
                <Text style={styles.sectionText}>{reservation.wishlist_id?.description}</Text>
                <Text style={styles.sectionText}>
                    Date de l’événement :{" "}
                    {reservation.wishlist_id?.dateEvent
                        ? new Date(reservation.wishlist_id.dateEvent).toLocaleDateString()
                        : "—"}
                </Text>
            </View>

            {/* Liste des cadeaux réservés */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Cadeaux réservés :</Text>
            <FlatList
                data={reservation.wishes || []}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.itemCard}>
                        <Image
                            source={item.image ? { uri: item.image } : require("../../assets/images/giftDefault.jpg")}
                            style={styles.itemImage}
                        />
                        <View style={styles.itemContent}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemPrice}>{item.price} €</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    syncBanner: {
        backgroundColor: "#e0ffe6",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        width: "90%",
    },
    syncText: {
        color: "#006400",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 14,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#6C2DC7",
        marginBottom: 10,
        textAlign: "center",
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#f4e9ff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        width: "100%",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6C2DC7",
        marginBottom: 6,
        alignItems: "center",
    },
    sectionText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 4,
    },
    itemCard: {
        flexDirection: "row",
        backgroundColor: "#fce4ff",
        borderRadius: 10,
        padding: 10,
        marginVertical: 6,
        alignItems: "center",
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    itemDesc: {
        fontSize: 14,
        color: "#555",
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6C2DC7",
    },
    error: {
        color: "red",
        fontSize: 16,
    },
});
