import Joi from "joi";

export const getByIdSchema = Joi.object({
    orderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.pattern.base": "Invalid Item ID format",
        "any.required": "Item ID is required"
    }),
});