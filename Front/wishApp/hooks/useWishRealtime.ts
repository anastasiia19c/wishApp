import { useEffect } from "react";
import { socket } from "../socket";

type Props = {
    onCreate: (wish: any) => void;
    onUpdate: (wish: any) => void;
    onDelete: (data: { id: string }) => void;
};

export const useWishRealtime = ({ onCreate, onUpdate, onDelete }: Props) => {
    useEffect(() => {
        socket.on("wish:created", onCreate);
        socket.on("wish:updated", onUpdate);
        socket.on("wish:deleted", onDelete);

        return () => {
            socket.off("wish:created", onCreate);
            socket.off("wish:updated", onUpdate);
            socket.off("wish:deleted", onDelete);
        };
    }, []);
};
