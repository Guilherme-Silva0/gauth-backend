const { compare } = require("bcrypt");
const userModel = require("../modules/userModel");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const createdUser = await userModel.createUser(req.body);
  if (createdUser.error === false) {
    return res.status(201).json(createdUser);
  } else {
    return res
      .status(400)
      .json({ error: true, message: "there was an error when creating user" });
  }
};

const confirmCode = async (req, res) => {
  const output = await userModel.confirmCode(req.params.confirmation_code);
  const token = jwt.sign({ userId: output.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.status(200).json({
    error: false,
    affectedRows: output.affectedRows,
    token,
  });
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.getUserByEmail(email);
  if (!(await compare(password, user[0].password))) {
    return res
      .status(400)
      .json({ error: true, message: "incorrect email or password" });
  }

  const token = jwt.sign({ userId: user[0].id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  res.status(200).send({
    error: false,
    token,
  });
};

const getUserById = async (req, res) => {
  const output = await userModel.getUserById(req.body.id);
  if (output.length === 0) {
    return res.status(400).json({ error: true, message: "please login first" });
  } else {
    return res.status(200).json({
      error: false,
      user: { name: output[0].name, email: output[0].email },
    });
  }
};

const passwordRecovery = async (req, res) => {
  const output = await userModel.passwordRecovery(req.body.email);
  if (output.error === true) {
    return res.status(400).json({ error: true, message: output.message });
  } else {
    return res.status(200).json(output);
  }
};

const updatePassword = async (req, res) => {
  const output = await userModel.updatePassword(
    req.body.password,
    req.params.confirmation_code
  );
  if (output.error === true) {
    return res.status(400).json({ error: true, message: output.message });
  } else {
    return res.status(200).json(output);
  }
};

module.exports = {
  createUser,
  confirmCode,
  authenticateUser,
  getUserById,
  passwordRecovery,
  updatePassword,
};
