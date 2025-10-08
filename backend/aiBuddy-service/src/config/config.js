import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT || 3004,
    nodeEnv: process.env.NODE_ENV || "development",
    clientURL : process.env.CLIENT_URL || "http://localhost:5173"
}   