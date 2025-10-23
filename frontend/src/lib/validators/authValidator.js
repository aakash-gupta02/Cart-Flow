import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});

// Generic validate function
export const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    return { isValid: false, errors: error.details.map(d => d.message) };
  }
  return { isValid: true, value };
};
