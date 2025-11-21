import NetInfo from "@react-native-community/netinfo";
import { ReservationStorage } from "./reservationStorage";
import { storageSingleton } from "../storageSingleton";

const API_BASE = "http://10.6.0.2:3000"; // adapte selon ton environnement

export async function syncReservations() {
    const state = await NetInfo.fetch();
    console.log("État réseau :", state.isConnected);

    if (!state.isConnected) {
        console.log("Pas de connexion, synchro annulée");
        return;
    }
    const storedId = await storageSingleton.getItem("reservation_id");
    if (storedId) {
            return;
    }

    const all = await ReservationStorage.getAll();
    const pending = all.filter((r) => !r.synced);

    console.log("Réservations à synchroniser :", pending.length);

    for (const res of pending) {
        try {
            const response = await fetch(`${API_BASE}/reservation/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await storageSingleton.getItem("token")}`
                },
                body: JSON.stringify({
                    user_id: res.user_id,
                    guest_id: res.guest_id,
                    wishlist_id: res.wishlist_id,
                    wishes: res.wishes,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Réservation synchronisée :", res.id);
                await ReservationStorage.markSynced(res.id!);
                return data.id;
            } else {
                console.warn("Erreur serveur :", response.status);
            }
        } catch (err) {
            console.error("Erreur réseau :", err);
        }
    }
}
