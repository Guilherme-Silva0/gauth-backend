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

  const token = jwt.sign({ userId: output.user.id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    error: false,
    affectedRows: output.affectedRows,
    user: {
      id: output.user.id,
      name: output.user.name,
      email: output.user.email,
    },
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
    expiresIn: "1h",
  });

  res.status(200).send({
    error: false,
    user: { id: user[0].id, name: user[0].name, email: user[0].email },
    token,
  });
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
  passwordRecovery,
  updatePassword,
};
