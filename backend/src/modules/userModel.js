const connection = require("./connection");

const createUser = async (user) => {
  const query = "INSERT INTO users VALUES(null,?,?,?)";
  const { name, email, password } = user;
  const [res] = await connection.execute(query, [name, email, password]);
  return res.insertId;
};

module.exports = {
  createUser,
};
