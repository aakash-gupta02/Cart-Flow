import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT || 3003,
    nodeEnv: process.env.NODE_ENV || "development",

    // api urls
    cartServiceURL: process.env.CART_SERVICE_URL || "http://localhost:3002",
    productServiceURL: process.env.PRODUCT_SERVICE_URL || "http://localhost:3001"
    ,
    mainEntryURL: process.env.MAIN_ENTRY_URL || "http://localhost:3000"

    
}   