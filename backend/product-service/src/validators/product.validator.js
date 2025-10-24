import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        "string.base": "Product name must be a string.",
        "string.empty": "Product name is required.",
        "string.min": "Product name must be at least 3 characters.",
        "string.max": "Product name must be at most 100 characters.",
        "any.required": "Product name is required."
    }),
    description: Joi.string().min(10).max(1000).required().messages({
        "string.base": "Description must be a string.",
        "string.empty": "Description is required.",
        "string.min": "Description must be at least 10 characters.",
        "string.max": "Description must be at most 1000 characters.",
        "any.required": "Description is required."
    }),
    priceAmount: Joi.number().min(0).required().messages({
        "number.base": "Price amount must be a number.",
        "number.min": "Price amount cannot be negative.",
        "any.required": "Price amount is required."
    }),
    priceCurrency: Joi.string().valid("USD", "EUR", "INR").default("INR").messages({
        "string.base": "Currency must be a string.",
        "any.only": "Currency must be one of USD, EUR, or INR."
    }),
    media: Joi.any().required().messages({
        "any.required": "Product image file (media) is required."
    }),
    stock: Joi.number().min(0).default(0).messages({
        "number.base": "Stock must be a number.",
        "number.min": "Stock cannot be negative."
    }),
    category: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Category must be an array.",
        "string.base": "Category items must be strings.",
        "any.required": "Category is required."
    })
});

export const productUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(100).messages({
        "string.base": "Product name must be a string.",
        "string.min": "Product name must be at least 3 characters.",
        "string.max": "Product name must be at most 100 characters."
    }),
    description: Joi.string().min(10).max(1000).messages({
        "string.base": "Description must be a string.",
        "string.min": "Description must be at least 10 characters.",
        "string.max": "Description must be at most 1000 characters."
    }),
    priceAmount: Joi.number().min(0).messages({
        "number.base": "Price amount must be a number.",
        "number.min": "Price amount cannot be negative."
    }),
    priceCurrency: Joi.string().valid("USD", "EUR", "INR").messages({
        "string.base": "Currency must be a string.",
        "any.only": "Currency must be one of USD, EUR, or INR."
    }),
    media: Joi.any().messages({
        "any.required": "Product image file (media) is required."
    }),
    stock: Joi.number().min(0).messages({
        "number.base": "Stock must be a number.",
        "number.min": "Stock cannot be negative."
    }),
    category: Joi.array().items(Joi.string()).messages({
        "array.base": "Category must be an array.",
        "string.base": "Category items must be strings."
    })
});

export const decreasedStockSchema = Joi.object({
    productId: Joi.string().length(24).hex().required().messages({
        "string.base": "Product ID must be a string.",
        "string.length": "Product ID must be 24 characters long.",
        "string.hex": "Product ID must be a valid hexadecimal string.",
        "any.required": "Product ID is required."
    }),
    quantity: Joi.number().min(1).required().messages({
        "number.base": "Quantity must be a number.",
        "number.min": "Quantity must be at least 1.",
        "any.required": "Quantity is required."
    })
});