const userModel = require("../modules/userModel");

const createUser = async (req, res) => {
  const createdUser = await userModel.createUser(req.body);
  return res.status(201).json(createdUser);
};

const confirmCode = async (req, res) => {
  const output = await userModel.confirmCode(req.params.confirmation_code);
  return res.status(200).json({ affectedRows: output });
};

module.exports = {
  createUser,
  confirmCode,
};
