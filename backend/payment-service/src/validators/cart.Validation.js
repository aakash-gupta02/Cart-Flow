import Joi from "joi";

export const addToCartSchema = Joi.object({
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.pattern.base": "Invalid product ID format",
        "any.required": "Product ID is required"
    }),
    quantity: Joi.number().integer().min(1).optional()
});
export const updateCartSchema = Joi.object({
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.pattern.base": "Invalid product ID format",
        "any.required": "Product ID is required"
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required"
    })
});

export const createPaymentSchema = Joi.object({
    orderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.pattern.base": "Invalid Item ID format",
        "any.required": "Item ID is required"
    }),
});





