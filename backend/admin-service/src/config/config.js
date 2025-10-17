import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 3007,
    nodeEnv: process.env.NODE_ENV || "development",

    // api urls

    // Gateway / main entry URL - services should call downstream via this host
    mainEntryURL: process.env.MAIN_ENTRY_URL || "http://localhost:3000",

    redisPassword: process.env.REDIS_PASSWORD,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT
}   