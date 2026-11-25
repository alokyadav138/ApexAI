import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {

    const allowedOrigins = [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ].filter(Boolean);

    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    console.log("Socket.io server is running");

    io.on("connection", (socket) => {
        console.log("A user connected:" + socket.id);
    });
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io is not initialized");
    }

    return io;
}