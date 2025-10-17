import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT || 3005,
    nodeEnv: process.env.NODE_ENV || "development",
    clientURL : process.env.CLIENT_URL || "http://localhost:5173",
    geminiKey: process.env.GEMINI_API_KEY || "",
    mainEntryURL: process.env.MAIN_ENTRY_URL || "http://localhost:3000",
    productUrl: process.env.MAIN_ENTRY_URL ? `${process.env.MAIN_ENTRY_URL}/api/product` : "http://localhost:3000/api/product",
    cartURL: process.env.MAIN_ENTRY_URL ? `${process.env.MAIN_ENTRY_URL}/api/cart` : "http://localhost:3000/api/cart",
}   