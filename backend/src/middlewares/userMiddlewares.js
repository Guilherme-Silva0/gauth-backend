const yup = require("yup");
const validateRegister = async (req, res, next) => {
  const schema = yup.object().shape({
    name: yup
      .string("name has to be of type string")
      .required("name is required!")
      .trim(),
    email: yup
      .string("email has to be of type string")
      .email("email invalid")
      .required("email is required!")
      .trim(),
    password: yup
      .string("password has to be of type string")
      .min(6, "the password must have at least 6 characters")
      .required("password is required!")
      .trim(),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: err.errors,
    });
  }
};

module.exports = {
  validateRegister,
};
