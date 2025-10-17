import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT || 3003,
    nodeEnv: process.env.NODE_ENV || "development",

    // Gateway / main entry URL - services should call downstream via this host
    mainEntryURL: process.env.MAIN_ENTRY_URL || "http://localhost:3000"

    
}   