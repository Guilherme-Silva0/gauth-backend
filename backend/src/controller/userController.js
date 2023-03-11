const userModel = require("../modules/userModel");

const createUser = async (req, res) => {
  const createdUser = await userModel.createUser(req.body);
  return res.status(201).json(createdUser);
};

module.exports = {
  createUser,
};
