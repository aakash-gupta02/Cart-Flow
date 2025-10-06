import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

export const generateAccessToken = (user) => {
    return jwt.sign({
        userid: user._id,
        role: user.role
    },
        config.jwtSecret,
        { expiresIn: "20m" }
    )
}

export const generateRefreshToken = (user) => {
    return jwt.sign({
        userid: user._id
    },
        config.jwtSecret,
        {
            expiresIn: "7d"
        })
}