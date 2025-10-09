import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT || 3005,
    nodeEnv: process.env.NODE_ENV || "development",
    clientURL : process.env.CLIENT_URL || "http://localhost:5173",
    geminiKey: process.env.GEMINI_API_KEY || "",
    productUrl: "http://localhost:3001/api/product",
    cartURL: "http://localhost:3002/api/cart",
}   