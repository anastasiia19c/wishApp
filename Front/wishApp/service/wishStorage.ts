import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

export interface Wish {
    _id: string;
    wishlist_id: string;
    title: string;
    image: string;
    price: number;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    synced?: boolean;
}

const STORAGE_KEY = "wishes";

export const WishStorage = {
    async getAll(): Promise<Wish[]> {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    },

    // Enregistrer une liste complète de souhaits (après un fetch en ligne)
    async setAll(wishes: Wish[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
            console.log(`${wishes.length} wishes sauvegardés localement`);
        } catch (err) {
            console.error("Erreur lors de la sauvegarde des wishes :", err);
        }
    },
    // Ajouter ou mettre à jour un wish spécifique
    async upsert(wish: Wish): Promise<void> {
        const all = await this.getAll();
        const index = all.findIndex((w) => w._id === wish._id);

        if (index >= 0) {
            all[index] = wish; // mise à jour
        } else {
            all.push(wish); // ajout
        }

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        console.log(`Wish ${wish.title} mis à jour/localement ajouté`);
    },
    // Supprimer un wish localement
    async remove(wishId: string): Promise<void> {
        const all = await this.getAll();
        const filtered = all.filter((w) => w._id !== wishId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        console.log(`Wish ${wishId} supprimé du stockage local`);
    },

    // Effacer tout le cache des wishes
    async clear(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log("Cache des wishes vidé");
    },
    async markSynced(id: string): Promise<void> {
        const all = await this.getAll();
        const updated = all.map((w) =>
            w._id === id ? { ...w, synced: true } : w
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

};
