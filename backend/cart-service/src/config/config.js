import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT || 3002,
    nodeEnv: process.env.NODE_ENV || "development",
    mainEntryURL: process.env.MAIN_ENTRY_URL || "http://localhost:3000",
}   