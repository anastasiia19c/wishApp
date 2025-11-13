import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { storageSingleton } from "../../../storageSingleton";
import NetInfo from "@react-native-community/netinfo";


type Wish = {
  _id: string;
  title: string;
  price: number;
  image?: string;
  url?: string;
};

type Reservation = {
  _id: string;
  user_id: string;
  wishes: Wish[];
  wishlist_id: {
    _id: string;
    title: string;
    user_id?: string;
    coverImage?: string;
  };
};

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = await storageSingleton.getItem("token");
      if (!token) {
        setErrorMessage("Session invalide, veuillez vous reconnecter.");
        return;
      }
      const storedUserId = await AsyncStorage.getItem("id") || await storageSingleton.getItem("user_id");
      if (!storedUserId) {
        setErrorMessage("Aucun utilisateur connecté.");
        setLoading(false);
        return;
      }
      // Si pas de connexion -> utilise le cache
      if (!isConnected) {
        const cached = await AsyncStorage.getItem("cached_reservations");
        if (cached) {
          setReservations(JSON.parse(cached));
          setErrorMessage("Mode hors ligne : affichage des données locales.");
        } else {
          setErrorMessage("Aucune donnée locale disponible.");
        }
        return;
      }

      const response = await fetch(`http://10.8.251.34:4000/reservation/user/${storedUserId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
      }

      const data = await response.json();
      setReservations(data);
      await AsyncStorage.setItem("cached_reservations", JSON.stringify(data));
    } catch (error) {
      console.warn("Impossible de récupérer les réservations :", error);
      // Fallback local en cas d'erreur réseau
      const cached = await AsyncStorage.getItem("cached_reservations");
      if (cached) {
        setReservations(JSON.parse(cached));
        setErrorMessage("Erreur réseau : affichage du cache local.");
      } else {
        setErrorMessage("Aucune donnée locale trouvée.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [isConnected]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#8e44ad" />
        <Text style={{ marginTop: 10, color: "#8e44ad" }}>Chargement...</Text>
      </View>
    );
  }

  const renderWish = ({ item }: { item: Wish }) => (
    <View style={styles.wishCard}>
      <Image
        source={item.image ? { uri: item.image } : require("../../../assets/images/giftDefault.jpg")}
        style={styles.wishImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.wishName}>{item.title}</Text>
        {item.url && <Text style={styles.wishLink}>{item.url}</Text>}
      </View>
      <Text style={styles.price}>{item.price}€</Text>
    </View>
  );

  const renderReservation = ({ item }: { item: Reservation }) => (
    <View style={styles.reservationCard}>
      {/* HEADER : Nom de la wishlist */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: item.wishlist_id?.coverImage || ("../../../assets/images/listDefault.jpg") }}
          style={styles.wishlistImage}
        />
        <View>
          <Text style={styles.wishlistTitle}>{item.wishlist_id?.title}</Text>
          <Text style={styles.author}>Par {item.wishlist_id?.user_id}</Text>
        </View>
      </View>

      {/* Liste des wishes */}
      <FlatList
        data={item.wishes}
        renderItem={renderWish}
        keyExtractor={(wish) => wish._id}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {isConnected === false && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            🔴 Vous êtes hors ligne — affichage des données locales.
          </Text>
        </View>
      )}
      {reservations.length === 0 ? (
        <Text style={styles.emptyText}>Aucune réservation trouvée.</Text>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderReservation}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5ff",
    paddingHorizontal: 16,
    paddingTop: 30,
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

  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#c77dff",
    textAlign: "center",
    paddingVertical: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
  },
  reservationCard: {
    backgroundColor: "#d9c6ff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  wishlistImage: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginRight: 10,
  },
  wishlistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e004f",
  },
  author: {
    fontSize: 14,
    color: "#4b0082",
  },
  wishCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#cbb2ff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
  },
  wishImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  wishName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e004f",
  },
  wishLink: {
    fontSize: 12,
    color: "#6a0080",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e004f",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#4b0082",
    fontSize: 16,
    marginTop: 40,
  },
});