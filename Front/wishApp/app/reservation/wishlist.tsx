import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { Stack } from "expo-router";

export default function WishlistScreen() {
    const [items, setItems] = useState([
        { id: "1", name: "Nom 1", description: "Description 1", reserved: false },
        { id: "2", name: "Nom 2", description: "Description 2", reserved: false },
        { id: "3", name: "Nom 3", lien: "lien", description: "Description 3", reserved: true },
    ]);

    const toggleReserve = (id: string) => {
        setItems((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, reserved: !item.reserved } : item
        )
        );
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
        {/* Image à gauche */}
        <Image
            source={require("../../assets/images/giftDefault.jpg")}
            style={styles.image}
        />

        {/* Texte + bouton à droite */}
        <View style={styles.content}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {item.lien && <Text style={styles.lien}>{item.lien}</Text>}

            <TouchableOpacity
            style={[styles.button, item.reserved && styles.buttonReserved]}
            onPress={() => toggleReserve(item.id)}
            >
            <Text style={styles.buttonText}>
                {item.reserved ? "RÉSERVÉ" : "RÉSERVER"}
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
        <Text style={styles.title}>Nom d'une wishlitst</Text>

        <View style={styles.infoRow}>
            <Image
                source={require("../../assets/images/listDefault.jpg")}
                style={styles.avatar}
            />
            <View>
                <Text style={styles.descriptionText}>Ceci est une description</Text>
                <Text style={styles.dateText}>Date de l’événement</Text>
                <Text style={styles.dateText}>Nom propriétaire</Text>
            </View>
        </View>
        <Text style={styles.header}>Souhaits</Text>

        {/* Liste scrollable */}
        <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
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
    },
    dateText: {
        fontSize: 14,
        color: "#555",
    },
});
