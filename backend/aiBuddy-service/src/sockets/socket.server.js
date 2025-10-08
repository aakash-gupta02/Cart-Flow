import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import AppError from "../utils/AppError.js"; 
import { config } from "../config/config.js";

export default function createSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: config.clientURL,
            credentials: true
        }
    });

    // middleware
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie?.split('accessToken=')[1];

            if (!token) {
                return next(new Error("Not authorized. No token provided."));
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return next(new Error("Access token expired."));
                    } else {
                        return next(new Error("Invalid token."));
                    }
                }

                socket.user = decoded; // Attach user info to socket
                next(); // Proceed to connection
            });
        } catch (err) {
            next(new Error("Authentication failed."));
        }
    });

    // connectiom
    io.on("connection", (socket) => {
        console.log(`✅ User connected: ${socket.user.userid}`);

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.user.userid}`);
        });
    });

    return io;
}
