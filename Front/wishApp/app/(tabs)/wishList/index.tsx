import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Image, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { storageSingleton } from "../../../storageSingleton";

export default function WishListScreen() {
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    closeDate: "",
    coverImage: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const user_id = await storageSingleton.getItem("id");
        const token = await storageSingleton.getItem("token");

        const res = await fetch(`http://localhost:4000/wishlist/user/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 404) {
            return;
          }
          const err = await res.json().catch(() => null);
          setErrorMessage(err?.message || "Impossible de charger les wishlists.");
          return;
        }

        const data = await res.json();
        setWishlists(data);
      } catch (error) {
        console.error("Erreur de récupération :", error);
        setErrorMessage("Erreur réseau lors du chargement des wishlists.");
      }
    };

    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      setRefreshing(true);
      const user_id = await storageSingleton.getItem("id");
      const token = await storageSingleton.getItem("token");

      const res = await fetch(`http://localhost:4000/wishlist/user/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      const data = await res.json();
      setWishlists(data);
    } catch (err) {
      console.error("Erreur fetch:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  const [showEventPicker, setShowEventPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setForm({ ...form, coverImage: `data:image/jpeg;base64,${result.assets[0].base64}`, });
    }
  };

  const toISO = (dateString: string) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
  };

  const handleCreate = async () => {
    try {
      const user_id = await storageSingleton.getItem("id");
      const token = await storageSingleton.getItem("token");

      if (!form.title) {
        setErrorMessage("Le titre est obligatoire.");
        return;
      }

      const response = await fetch("http://localhost:4000/wishlist/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          title: form.title,
          description: form.description,
          dateEvent: toISO(form.eventDate),
          dateClosed: toISO(form.closeDate),
          coverImage: form.coverImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setErrorMessage(errorData?.message || "Une erreur est survenue lors de la création.");
        return;
      }

      const data = await response.json();
      setWishlists((prev) => [...prev, data]);
      setForm({ title: "", description: "", eventDate: "", closeDate: "", coverImage: "" });
      setErrorMessage(null);
      setModalVisible(false);

    } catch (err) {
      console.error("Erreur réseau:", err);
      setErrorMessage("Impossible de contacter le serveur. Vérifie ta connexion.");
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={item.coverImage ? { uri: item.coverImage } : require("../../../assets/images/listDefault.jpg")}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>
        Date : {item.dateEvent ? new Date(item.dateEvent).toLocaleDateString() : "Non définie"}
      </Text>
      <Text style={styles.cardText}>
        {item.wishes?.length || 0} cadeaux
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {wishlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Crée ta première wishlist</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <><FlatList
            data={wishlists}
            renderItem={renderItem}
            keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
            numColumns={2}
            contentContainerStyle={styles.list} 
            refreshing={refreshing}
            onRefresh={fetchWishlists}/>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton1}>
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity></>
      )}

      {/* Modal ajout wish-list */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={25} color={"#000000ff"} style={{alignSelf: "flex-end", paddingBottom: 10}}/>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Ajouter une wishlist</Text>
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Nom*"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
            <TextInput
              editable
              multiline
              style={styles.description}
              placeholder="Description"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
            {/* Sélecteur pour Date de l'événement */}
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={form.eventDate ? form.eventDate.split("/").reverse().join("-") : ""}
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  setForm({ ...form, eventDate: `${day}/${month}/${year}` });
                }}
                style={styles.dateEvent}
              />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowEventPicker(true)}>
                  <TextInput
                    style={styles.dateEvent}
                    placeholder="Date de l'événement*"
                    value={form.eventDate}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {showEventPicker && (
                  <DateTimePicker
                    value={
                      form.eventDate
                        ? new Date(form.eventDate.split("/").reverse().join("-"))
                        : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowEventPicker(false);
                      if (selectedDate) {
                        setForm({ ...form, eventDate: formatDate(selectedDate) });
                      }
                    }}
                  />
                )}
              </>
            )}
            {/* Sélecteur Date de fermeture */}
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={form.closeDate ? form.closeDate.split("/").reverse().join("-") : ""}
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  setForm({ ...form, closeDate: `${day}/${month}/${year}` });
                }}
                style={styles.dateClosed}
              />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowClosePicker(true)}>
                  <TextInput
                    style={styles.dateClosed}
                    placeholder="Date de fermeture*"
                    value={form.closeDate}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {showClosePicker && (
                  <DateTimePicker
                    value={
                      form.closeDate
                        ? new Date(form.closeDate.split("/").reverse().join("-"))
                        : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowClosePicker(false);
                      if (selectedDate) {
                        setForm({ ...form, closeDate: formatDate(selectedDate) });
                      }
                    }}
                  />
                )}
              </>
            )}
            {/* Image */}
            <TouchableOpacity
              style={styles.image}
              onPress={pickImage}
            >
              <MaterialCommunityIcons name="file-image-plus-outline" size={25} color={"#000000ff"}/>
            </TouchableOpacity>

            {form.coverImage ? (
              <Image source={{ uri: form.coverImage }} style={styles.coverImage} />
            ) : null}

            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createButtonText}>CRÉER</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingVertical: 15,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#A64DFF",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#fdb5f4ff",
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  addButton1: {
    backgroundColor: "rgba(253, 181, 244, 0.7)", 
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    margin: 5,
    position: "absolute",
    bottom: 10,
    right: 10
  },
  plus: { fontSize: 70, color: "#A64DFF", fontWeight: "bold" },
  list: { padding: 15 },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fce4ff",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardText: { fontSize: 13, color: "gray" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#A64DFF",
    marginBottom: 15,
    paddingVertical: 5,
  },
  description:{
    borderBottomWidth: 1,
    borderBottomColor: "#A64DFF",
    marginBottom: 15,
    paddingVertical: 5,
    height: 50
  },
  createButton: {
    backgroundColor: "#6C2DC7",
    padding: 12,
    borderRadius: 25,
    alignSelf: "center",
    alignItems: "center",
    width: "50%"
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dateEvent: {
    borderBottomWidth: 1, 
    padding: 10, 
    borderColor: "#A64DFF",
    marginBottom: 10 
  },
  dateClosed:{
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "#A64DFF",
  },
  image:{
    marginTop: 10,
    padding: 15, 
    alignItems: "center", 
    marginBottom: 10
  },
  coverImage: {
    width: 100, 
    height: 100, 
    borderRadius: 10, 
    marginBottom: 10,
    alignSelf: "center", 
    justifyContent: "center"
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
});
