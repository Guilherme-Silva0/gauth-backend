const yup = require("yup");
const userModel = require("../modules/userModel");

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
    const alreadyRegisteredUser = await userModel.getUserByEmail(
      req.body.email
    );

    if (alreadyRegisteredUser.length > 0) {
      return res
        .status(400)
        .json({ error: true, message: "this email is already registered" });
    }
    next();
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: err.errors,
    });
  }
};

const validateCode = async (req, res, next) => {
  const isValidCode = await userModel.checkCode(req.params.confirmation_code);
  if (isValidCode.length === 0)
    return res.status(404).json({ error: true, message: "invalid code" });
  next();
};

const validateLogin = async (req, res, next) => {
  const schema = yup.object().shape({
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
    const user = await userModel.getUserByEmail(req.body.email);
    if (user.length < 1) {
      return res
        .status(400)
        .json({ error: true, message: "incorrect email or password" });
    }
    if (user[0].status_register === "new") {
      return res
        .status(400)
        .json({ error: true, message: "unconfirmed email" });
    }
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
  validateCode,
  validateLogin,
};
