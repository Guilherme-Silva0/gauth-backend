const { compare } = require("bcrypt");
const userModel = require("../modules/userModel");

const createUser = async (req, res) => {
  const createdUser = await userModel.createUser(req.body);
  return res.status(201).json(createdUser);
};

const confirmCode = async (req, res) => {
  const output = await userModel.confirmCode(req.params.confirmation_code);
  return res.status(200).json({ error: false, affectedRows: output });
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.getUserByEmail(email);
  if (!(await compare(password, user[0].password))) {
    return res
      .status(400)
      .json({ error: true, message: "incorrect email or password" });
  }
  res.status(200).send({ error: false, message: "successful login" });
};

module.exports = {
  createUser,
  confirmCode,
  authenticateUser,
};
