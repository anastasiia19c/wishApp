import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { Stack, router } from "expo-router";
import { storageSingleton } from "../../storageSingleton";
import { ReservationStorage } from "../../service/reservationStorage";
import { syncReservations } from "../../service/syncService";
import NetInfo from "@react-native-community/netinfo";
import { WishStorage } from "../../service/wishStorage";

export default function WishlistScreen() {
    const [wishlist, setWishlist] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [wasOffline, setWasOffline] = useState(false);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await storageSingleton.getItem("token");
                const currentUserId = await storageSingleton.getItem("user_id");
                if (!token) {
                    setErrorMessage("Session invalide, veuillez vous reconnecter.");
                    return;
                }

                // Infos wishlist
                const resWishlist = await fetch(
                    "http://10.8.251.34:4000/wishlist/690869eeb4bb6e4833e1f39d/6908692db4bb6e4833e1f399",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const dataWishlist = await resWishlist.json();
                if (currentUserId && dataWishlist.user_id === currentUserId) {
                    setErrorMessage("Vous êtes le propriétaire de cette liste. Vous ne pouvez pas réserver vos propres cadeaux.");
                    setLoading(false);
                    return;
                }
                setWishlist(dataWishlist);

                // Souhaits liés
                const resWishes = await fetch(
                    "http://10.8.251.34:4000/wish/wishlist/690869eeb4bb6e4833e1f39d/available",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const dataWishes = await resWishes.json();
                setItems(dataWishes);
                await WishStorage.setAll(dataWishes);

            } catch (err) {
                console.error(err);
                setErrorMessage("Impossible de charger les données.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let firstCheck = true;

        const unsubscribe = NetInfo.addEventListener(async (state) => {
            if (firstCheck) {
                firstCheck = false;
                return;
            }

            if (state.isConnected) {
                console.log("Reconnexion détectée — lancement de synchronisation");

                try {
                    const reservationId = await syncReservations();

                    if (reservationId) {
                        const now = new Date().toLocaleString();
                        await storageSingleton.setItem("last_sync", now);
                        await storageSingleton.setItem("reservation_id", reservationId);
                        router.replace("/reservation/succes");
                    } else {
                        console.log("ℹAucune réservation en attente à synchroniser.");
                    }
                } catch (err) {
                    console.error("Erreur pendant la synchro :", err);
                }
                // Affiche la bannière verte pendant 3 sec
                if (wasOffline) {
                    setIsConnected(true);
                    setTimeout(() => setIsConnected(null), 3000);
                    setWasOffline(false);
                }
            } else {
                console.log("Hors ligne");
                setIsConnected(false);
                setWasOffline(true);
                const localWishes = await WishStorage.getAll();
                setItems(localWishes);
            }
        });

        return () => unsubscribe();
    }, [wasOffline]);


    useEffect(() => {
        if (infoMessage) {
            const timer = setTimeout(() => setInfoMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [infoMessage]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6C2DC7" />
            </View>
        );
    }

    if (!wishlist) {
        return (
            <View style={styles.center}>
                <Text>Aucune wishlist trouvée.</Text>
            </View>
        );
    }

    const toggleReserve = (id: string) => {
        setItems((prev) => {
            // compter combien d'items sont déjà "wanted"
            const alreadySelected = prev.filter((item) => item.status === "wanted").length;

            return prev.map((item) => {
                if (item._id === id) {
                    // si déjà sélectionné → on le désélectionne
                    if (item.status === "wanted") {
                        return { ...item, status: "available" };
                    }

                    // si pas encore sélectionné → vérifier la limite de 3
                    if (alreadySelected >= 3) {
                        setErrorMessage("Vous ne pouvez réserver que 3 cadeaux.");
                        return item; // pas de changement
                    }

                    return { ...item, status: "wanted" };
                }
                return item;
            });
        });
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Image
                source={item.image ? { uri: item.image } : require("../../assets/images/giftDefault.jpg")}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>{item.price} €</Text>
                <TouchableOpacity
                    style={[
                        styles.button,
                        item.status !== "available" && styles.buttonReserved,
                    ]}
                    onPress={() => toggleReserve(item._id)}
                >
                    <Text style={styles.buttonText}>
                        {item.status === "available" ? "RÉSERVER" : "RÉSERVÉ"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const saveReservation = async () => {
        try {
            const token = await storageSingleton.getItem("token");
            const role = await storageSingleton.getItem("role");
            const guestId = await storageSingleton.getItem("guest_id");
            const userId = await storageSingleton.getItem("user_id");

            if (!token || !role) {
                setErrorMessage("Session invalide, veuillez vous reconnecter.");
                return;
            }
            const selectedWishes = items
                .filter((item) => item.status === "wanted")
                .map((item) => item._id);

            if (selectedWishes.length === 0) {
                setErrorMessage("Veuillez sélectionner au moins un cadeau.");
                return;
            }

            const body = {
                wishlist_id: wishlist._id,
                wishes: selectedWishes,
                user_id: userId ?? null,
                guest_id: guestId ?? null,
            };

            //  Toujours sauvegarder localement
            await ReservationStorage.save(body);
            console.log("Réservation enregistrée localement");

            // Vérifie la connexion avant d’essayer d’envoyer
            const state = await NetInfo.fetch();

            if (!state.isConnected) {
                setInfoMessage("Mode hors ligne — la réservation sera synchronisée dès la reconnexion.");
                return; //  stoppe ici si pas de connexion
            }

            if (state.isConnected) {
                const reservationId = await syncReservations();
                // Si connecté, on envoie maintenant
                console.log("En ligne — envoi immédiat vers le serveur");
                await storageSingleton.setItem("reservation_id", reservationId);
                setInfoMessage("Réservation synchronisée avec le serveur !");
                router.replace("/reservation/succes");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Impossible d’enregistrer votre choix.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Désactive le header */}
            <Stack.Screen options={{ headerShown: false }} />
            {isConnected === false && (
                <View style={styles.offlineBanner}>
                    <Text style={styles.offlineText}>
                        🔴 Vous êtes hors ligne — votre réservation sera enregistrée localement.
                    </Text>
                </View>
            )}
            {isConnected === true && (
                <View style={styles.onlineBanner}>
                    <Text style={styles.onlineText}>
                        🟢 Connexion rétablie — synchronisation en cours...
                    </Text>
                </View>
            )}
            { /* === ENTÊTE WISHLIST === */}
            <Text style={styles.title}>{wishlist.title}</Text>

            <View style={styles.infoRow}>
                <Image
                    source={require("../../assets/images/listDefault.jpg")}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.descriptionText}>{wishlist.description || "Pas de description"}</Text>
                    <Text style={styles.dateText}>Date de l’événement :{" "} {new Date(wishlist.dateEvent).toLocaleDateString()}</Text>
                </View>
            </View>
            <Text style={styles.header}>Souhaits</Text>

            {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            {infoMessage && (
                <View style={styles.infoBanner}>
                    <Text style={styles.infoText}>{infoMessage}</Text>
                </View>
            )}


            {/* Liste scrollable */}
            <FlatList
                data={items.filter((item) => item.status === "available" || item.status === "wanted")}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 120 }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Bouton fixe en bas */}
            <TouchableOpacity
                style={styles.saveButton}
                onPress={saveReservation}
            >
                <Text style={styles.saveButtonText}>ENREGISTRER MON CHOIX</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    infoBanner: {
        backgroundColor: "#e6e6ff",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 10,
        alignItems: "center",
    },
    infoText: {
        color: "#333",
        fontWeight: "600",
        textAlign: "center",
    },

    offlineBanner: {
        backgroundColor: "#ffcccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    offlineText: {
        color: "#b00020",
        fontWeight: "600",
        textAlign: "center",
    },

    onlineBanner: {
        backgroundColor: "#d9ffd9",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    onlineText: {
        color: "#007a00",
        fontWeight: "600",
        textAlign: "center",
    },


    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fce4ff",
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15,
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: "gray",
        marginBottom: 10,
    },
    lien: {
        fontSize: 14,
        marginBottom: 10,
    },
    button: {
        alignSelf: "flex-start",
        backgroundColor: "#6C2DC7",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonReserved: {
        backgroundColor: "#aaa", // gris si réservé
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    saveButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#6C2DC7",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    /* === ENTÊTE WISHLIST === */
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 40, // rond
        marginRight: 15,
        backgroundColor: "#eee",
    },
    descriptionText: {
        fontSize: 16,
        color: "gray",
        marginBottom: 4,
        maxWidth: 200
    },
    dateText: {
        fontSize: 14,
        color: "#555",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 10,
        textAlign: "center",
    }
});
