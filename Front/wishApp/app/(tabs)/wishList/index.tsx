import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WishListScreen() {
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    closeDate: "",
  });

  const handleCreate = () => {
    if (!form.title) return;

    const newList = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      eventDate: form.eventDate,
      closeDate: form.closeDate,
      giftsCount: 0,
      image: null,
    };

    setWishlists((prev) => [...prev, newList]);
    setForm({ title: "", description: "", eventDate: "", closeDate: "" });
    setModalVisible(false);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={item.image ? { uri: item.image } : require("../../../assets/images/listDefault.jpg")}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>Date : {item.eventDate || "Non définie"}</Text>
      <Text style={styles.cardText}>{item.giftsCount} cadeaux</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {wishlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Crée ton premier wish-list</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <><FlatList
            data={wishlists}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.list} />
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton1}>
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity></>
      )}

      {/* Modal ajout wish-list */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un wish list</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Date de l'événement (JJ/MM/AAAA)"
              value={form.eventDate}
              onChangeText={(text) => setForm({ ...form, eventDate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Date de fermeture (JJ/MM/AAAA)"
              value={form.closeDate}
              onChangeText={(text) => setForm({ ...form, closeDate: text })}
            />

            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createButtonText}>CRÉER</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ marginTop: 10, color: "red" }}>Fermer</Text>
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
    backgroundColor: "#fdb5f4ff",
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
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
  createButton: {
    backgroundColor: "#6C2DC7",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
