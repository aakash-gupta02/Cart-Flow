import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT || 3002,
    nodeEnv: process.env.NODE_ENV || "development",

    orderServiceURL: process.env.ORDER_SERVICE_URL || "http://localhost:3003",

    mainEntryURL: process.env.MAIN_ENTRY_URL || "http://localhost:3000",

    clientURL: process.env.CLIENT_URL || "http://localhost:5173",
    
    razorPayKeyId: process.env.RAZORPAY_KEY_ID,
    razorPayKeySecret: process.env.RAZORPAY_KEY_SECRET,
}   