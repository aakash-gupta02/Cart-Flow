import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT || 3006,
    nodeEnv: process.env.NODE_ENV || "development",

    mainEntryURL: process.env.MAIN_ENTRY_URL || "http://localhost:3000",

    redisPassword: process.env.REDIS_PASSWORD,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT
}   