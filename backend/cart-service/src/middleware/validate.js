// Generic middleware to validate req.body against a Joi schema
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};

export default validate;

export const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};
