import Joi from 'joi';

// User Registration Schema
export const registerValidator = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 50 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  role: Joi.string().valid('user', 'seller').required().messages({
    "any.only": "Role must be either 'user' or 'seller'",
    "string.empty": "Role is required"
  })


});

// user login validation schema
export const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is Required",
    "string.email": "Email must be valid"
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be atleast 6 characters"
  })

})

