export function mergeReservations(local: any, server: any, lastSync: number) {
    if (!local) return server;
    if (!server) return local;

    const localUpdated = new Date(local.lastModified || 0).getTime();
    const serverUpdated = new Date(server.updatedAt || 0).getTime();

    // Si serveur plus récent
    if (serverUpdated > lastSync && serverUpdated > localUpdated) {
        console.log("🟢 Mise à jour depuis le serveur");
        return {
            ...local,
            ...server,
            // 🔁 fusionner proprement les cadeaux
            wishes: mergeWishes(local.wishes, server.wishes),
            synced: true,
            lastModified: new Date().toISOString(),
        };
    }

    // Si version locale plus récente
    if (localUpdated > lastSync && localUpdated > serverUpdated) {
        console.log("🟠 Garde la version locale");
        return {
            ...server,
            ...local,
            wishes: mergeWishes(server.wishes, local.wishes),
            synced: false,
        };
    }

    // Sinon : fusion neutre
    return {
        ...server,
        ...local,
        wishes: mergeWishes(local.wishes, server.wishes),
    };
}

/**
 * Fusion intelligente des cadeaux (wishes)
 * - garde les nouveaux cadeaux
 * - met à jour ceux modifiés
 * - supprime ceux supprimés côté serveur
 */
function mergeWishes(localWishes: any[] = [], serverWishes: any[] = []) {
    const merged: any[] = [];

    const allIds = new Set([
        ...localWishes.map((w) => w._id || w.id),
        ...serverWishes.map((w) => w._id || w.id),
    ]);

    for (const id of allIds) {
        const localWish = localWishes.find((w) => w._id === id || w.id === id);
        const serverWish = serverWishes.find((w) => w._id === id || w.id === id);

        if (localWish && !serverWish) {
            // cadeau supprimé du serveur → ignorer
            continue;
        }

        if (!localWish && serverWish) {
            // cadeau ajouté côté serveur
            merged.push(serverWish);
            continue;
        }

        if (localWish && serverWish) {
            // cadeau modifié → on garde le plus récent
            const localDate = new Date(localWish.updatedAt || 0).getTime();
            const serverDate = new Date(serverWish.updatedAt || 0).getTime();

            merged.push(serverDate > localDate ? serverWish : localWish);
        }
    }

    return merged;
}
