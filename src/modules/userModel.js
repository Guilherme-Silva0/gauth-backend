const connection = require("./connection");

const createUser = async (user) => {
  const { name, email, password } = user;
  const queryInsert = "INSERT INTO users VALUES(null,?,?,?)";

  const [resInsert] = await connection.execute(queryInsert, [
    name,
    email,
    password,
  ]);
  return { insertId: resInsert.insertId };
};

const getUser = async (user) => {
  const querySelect = "SELECT * FROM users WHERE email=?";
  const [resSelect] = await connection.execute(querySelect, [user.email]);
  return resSelect;
};

module.exports = {
  createUser,
  getUser,
};
