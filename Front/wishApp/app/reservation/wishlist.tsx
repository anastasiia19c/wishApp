import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert,ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { storageSingleton } from "../../storageSingleton";

export default function WishlistScreen() {
    const [wishlist, setWishlist] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const token = await storageSingleton.getItem("token");
            if (!token) {
            Alert.alert("Erreur", "Token manquant. Veuillez vous reconnecter.");
            return;
            }

            // Infos wishlist
            const resWishlist = await fetch(
                "http://localhost:4000/wishlist/68cd56a70b14017858596fd6/68cd567f0b14017858596fd1",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const dataWishlist = await resWishlist.json();
            setWishlist(dataWishlist);

            // Souhaits liés
            const resWishes = await fetch(
                "http://localhost:4000/wish/wishlist/68cd56a70b14017858596fd6/available",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const dataWishes = await resWishes.json();
            setItems(dataWishes);
        } catch (err) {
            console.error(err);
            Alert.alert("Erreur", "Impossible de charger les données.");
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);

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
                        Alert.alert("Limite atteinte", "Vous ne pouvez réserver que 3 cadeaux.");
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
                source={ item.image ? { uri: item.image } : require("../../assets/images/giftDefault.jpg") }
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

    return (
        <View style={styles.container}>
        {/* Désactive le header */}
        <Stack.Screen options={{ headerShown: false }} />
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
            onPress={() => alert("Choix enregistré !")}
        >
            <Text style={styles.saveButtonText}>ENREGISTRER MON CHOIX</Text>
        </TouchableOpacity>
        </View>
    );
    }

    const styles = StyleSheet.create({
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
});
