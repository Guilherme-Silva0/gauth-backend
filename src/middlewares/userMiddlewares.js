const yup = require("yup");
const jwt = require("jsonwebtoken");
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
      .min(8, "the password must have at least 8 characters")
      .required("password is required!")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-@#$%^&*()_+=[\]{}|\\,./<>?;:'"`~])/,
        "Password must include at least one uppercase letter, one lowercase letter, one number and one special character"
      )
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
    return res.status(400).json({ error: true, message: "invalid code" });
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

const validateToken = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(400).json({
      error: true,
      message: "please login first",
    });
  }

  const token = authToken.split(" ")[1];
  try {
    const { userId } = jwt.verify(token, process.env.SECRET_KEY);
    req.body.id = userId;
    next();
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: "please login first",
    });
  }
};

const validatePasswordRecovery = async (req, res, next) => {
  const schema = yup.object().shape({
    email: yup
      .string("email has to be of type string")
      .email("email invalid")
      .required("email is required!")
      .trim(),
  });

  try {
    await schema.validate(req.body);
    const user = await userModel.getUserByEmail(req.body.email);
    if (user.length < 1) {
      return res
        .status(400)
        .json({ error: true, message: "email not registered" });
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

const validateUpdatePassword = async (req, res, next) => {
  const schema = yup.object().shape({
    password: yup
      .string("password has to be of type string")
      .min(6, "the password must have at least 6 characters")
      .required("password is required!")
      .trim(),
  });

  try {
    await schema.validate(req.body);
    const isValidCode = await userModel.checkCode(req.params.confirmation_code);
    if (isValidCode.length === 0) {
      return res.status(400).json({ error: true, message: "invalid code" });
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
  validateToken,
  validatePasswordRecovery,
  validateUpdatePassword,
};
