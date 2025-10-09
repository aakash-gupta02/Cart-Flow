import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import AppError from "../utils/AppError.js";
import { config } from "../config/config.js";
import { agent } from "../agent/agents/product-agent.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";


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
                        return next(new AppError("Access token expired.", 401));
                    } else {
                        return next(new AppError("Invalid token.", 401));
                    }
                }

                socket.user = decoded; // Attach user info to socket
                socket.accessToken = token;
                next(); // Proceed to connection
            });
        } catch (err) {
            next(new Error("Authentication failed."));
        }
    });

    // connectiom
    io.on("connection", (socket) => {
        console.log(`✅ User connected: ${socket.user.userid} `);
        console.log("Socket ID:", socket.accessToken);



        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.user.userid}`);
        });

        socket.on("message", async (msg) => {
            try {
                // Initialize state with user's message and access token
                const initialState = {
                    messages: [new HumanMessage(msg)],
                    accessToken: socket.accessToken
                };

                // Call agent
                const finalState = await agent.invoke(initialState,
                    {
                        metadata: {
                            accessToken: socket.accessToken
                        }
                    }
                );

                // Find the last AIMessage in the conversation
                const lastAIMessage = finalState.messages
                    .slice() // clone array
                    .reverse() // start from the end
                    .find((m) => m instanceof AIMessage);

                // Emit AI message content to frontend
                socket.emit("message", lastAIMessage?.content || "Sorry, no response.");
                console.log("Agent Response:", lastAIMessage?.content);
            } catch (error) {
                console.error("Agent Error:", error);
                socket.emit("message", "❌ Error occurred while processing your request.");
            }
        });

    });

    return io;
}
