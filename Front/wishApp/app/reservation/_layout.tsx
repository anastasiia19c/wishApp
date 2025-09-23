import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { storageSingleton } from "../../storageSingleton";

export default function ReservationLayout() {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkRole = async () => {
        const role = await storageSingleton.getItem("role");
        if (!role) {
            setAllowed(false);
            router.replace("/");
        }

        if (role === "guest") {
            setAllowed(true); // OK, accès autorisé
        } else {
            setAllowed(false);
            router.replace("/"); // redirige owner ailleurs
        }
        setLoading(false);
        };
        checkRole();
    }, []);

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#6C2DC7" />
        </View>
        );
    }

    if (!allowed) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Accès interdit</Text>
        </View>
        );
    }

    return <Stack />;
}
