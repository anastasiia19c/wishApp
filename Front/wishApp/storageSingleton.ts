// storageSingleton.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageSingleton {
    private static instance: StorageSingleton;

    private constructor() {}

    static getInstance(): StorageSingleton {
        if (!StorageSingleton.instance) {
        StorageSingleton.instance = new StorageSingleton();
        }
        return StorageSingleton.instance;
    }

    async getItem(key: string): Promise<string | null> {
        try {
        const value = await AsyncStorage.getItem(key);
        return value; // Pas besoin de vérifier, il renvoie déjà null si non trouvé.
        } catch (error) {
        console.error('Erreur lors de la récupération de l\'élément depuis AsyncStorage:', error);
        return null;
        }
    }
    

    async setItem(key: string, value: string | null): Promise<void> {
    try {
        if (value === null) {
        await AsyncStorage.removeItem(key);
        } else {
        await AsyncStorage.setItem(key, value);
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
    }
    }


    async removeItem(key: string): Promise<void> {
        try {
        await AsyncStorage.removeItem(key);
        } catch (error) {
        console.error('Erreur lors de la suppression de l\'élément dans AsyncStorage:', error);
        }
    }
}

export const storageSingleton = StorageSingleton.getInstance();