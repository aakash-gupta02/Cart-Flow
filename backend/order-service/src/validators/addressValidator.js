import joi from "joi";

export const addressValidator = joi.object({
    street: joi.string().max(100).required().messages({
        "string.empty": "Street is required",
        "string.max": "Street must be less than 100 characters",
    }),
    city: joi.string().max(50).required().messages({
        "string.empty": "City is required",
        "string.max": "City must be less than 50 characters",
    }),
    state: joi.string().max(50).required().messages({
        "string.empty": "State is required",
        "string.max": "State must be less than 50 characters",
    }),
    zip: joi.string().max(20).required().messages({
        "string.empty": "Zip Code is required",
        "string.max": "Zip Code must be less than 20 characters",
    }),
    country: joi.string().max(50).required().messages({
        "string.empty": "Country is required",
        "string.max": "Country must be less than 50 characters",
    }),
});

export const statusUpdateValidator = joi.object({
    status: joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").required().messages({
        "any.only": "Status must be one of 'pending', 'shipped', 'delivered', 'cancelled'",
        "string.empty": "Status is required",
    }),
});

export const addressUpdateValidator = joi.object({
    street: joi.string().max(100).messages({
        "string.max": "Street must be less than 100 characters",
    }),
    city: joi.string().max(50).messages({
        "string.max": "City must be less than 50 characters",
    }),
    state: joi.string().max(50).messages({
        "string.max": "State must be less than 50 characters",
    }),
    zip: joi.string().max(20).messages({
        "string.max": "Zip Code must be less than 20 characters",
    }),
    country: joi.string().max(50).messages({
        "string.max": "Country must be less than 50 characters",
    }),
    isDefault: joi.boolean().optional()
});

