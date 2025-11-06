import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

export interface Reservation {
    id?: string;
    user_id: string | null;
    guest_id: string | null;
    wishlist_id: string;
    wishes: string[];
    synced?: boolean;
    lastModified?: string;
}

const STORAGE_KEY = "reservations";

export const ReservationStorage = {
    async getAll(): Promise<Reservation[]> {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    },

    async save(reservation: Reservation): Promise<void> {
        const all = await this.getAll();

        const newReservation: Reservation = {
            ...reservation,
            id: reservation.id || `local-${uuidv4()}`,
            synced: false,
            lastModified: new Date().toISOString(),
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...all, newReservation]));
    },

    async markSynced(id: string): Promise<void> {
        const all = await this.getAll();
        const updated = all.map((r) =>
            r.id === id ? { ...r, synced: true } : r
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    async setAll(reservations: Reservation[]): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    },
};
