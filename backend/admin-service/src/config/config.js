import dotenv from "dotenv"
dotenv.config()

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 3007,
    nodeEnv: process.env.NODE_ENV || "development",

    // api urls
    authServiceURL: process.env.AUTH_SERVICE_URL || "http://localhost:3000",
    productServiceURL: process.env.PRODUCT_SERVICE_URL || "http://localhost:3001",
    cartServiceURL: process.env.CART_SERVICE_URL || "http://localhost:3002",
    orderServiceURL: process.env.ORDER_SERVICE_URL || "http://localhost:3004",
    paymentServiceURL: process.env.PAYMENT_SERVICE_URL || "http://localhost:3004",

    redisPassword: process.env.REDIS_PASSWORD,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT
}   