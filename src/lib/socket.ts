import { Socket, io } from "socket.io-client";

let socket:Socket | null = null;

export function getSocket() {
    if(!socket){
        const defaultSocketUrl =
          typeof window !== "undefined"
            ? `${window.location.protocol}//${window.location.hostname}:5000`
            : undefined;
        socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || defaultSocketUrl);
    }
    return socket;
}
