import { config } from "../config/config.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js"
import jwt from "jsonwebtoken"


export const protect = catchAsync(async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("Not authorized", 401));
    }

    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded

    next()

})

export const accessTo = (...roles)=>{
    return (req, res, next)=>{
        if (!roles.includes(req.user.role)) {
            return next( new AppError("You do not have permission",403))
        }
        next()
    }
}