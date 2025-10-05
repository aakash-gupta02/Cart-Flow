import { config } from "../config/config.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js"
import jwt from "jsonwebtoken"


export const protect = catchAsync(async (req, res, next) => {

    // let token;
    // if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    //     token = req.headers.authorization.split(" ")[1];
    // }

    const token = req.cookies.accessToken

    if (!token) {
        return next(new AppError("Not authorized", 401));
    }



    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return next(new AppError("Access token expired. Please login again.", 401));
            }
            if (err.name === "JsonWebTokenError") {
                return next(new AppError("Invalid token. Please login again.", 401));
            }
            return next(new AppError("Authentication error", 401));
        }

        req.user = decoded;
        next();
    });

})

export const accessTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission", 403))
        }
        next()
    }
}