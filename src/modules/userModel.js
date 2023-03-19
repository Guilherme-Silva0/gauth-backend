require("dotenv").config();
const { randomInt } = require("node:crypto");
const { hash } = require("bcrypt");
const nodemailer = require("nodemailer");
const connection = require("./connection");
const uuidv4 = require("uuid").v4;

const createUser = async (user) => {
  const { name, email, password } = user;
  const status_register = "new";
  const confirmation_code = uuidv4();
  const queryInsert = "INSERT INTO users VALUES(null,?,?,?,?,?)";
  const encryptedPassword = await encryptPassword(password);

  const [resInsert] = await connection.query(queryInsert, [
    name,
    email,
    encryptedPassword,
    status_register,
    confirmation_code,
  ]);

  if (resInsert.insertId) {
    await sendEmailConfirm(confirmCode, email);
    return { error: false, insertId: resInsert.insertId };
  }
};

const encryptPassword = async (password) => {
  const randomSalt = randomInt(10, 16);
  const passwordHash = await hash(password, randomSalt);
  return passwordHash;
};

const checkCode = async (confirmation_code) => {
  const querySelect = "SELECT * FROM users WHERE confirmation_code=? LIMIT 1";
  const [resSelect] = await connection.query(querySelect, [confirmation_code]);
  return resSelect;
};

const confirmCode = async (confirmation_code) => {
  const status = "confirmed";
  const queryUpdate =
    "UPDATE users SET status_register=? WHERE confirmation_code=?";
  const [resUpdate] = await connection.query(queryUpdate, [
    status,
    confirmation_code,
  ]);
  return resUpdate.affectedRows;
};

const passwordRecovery = async (email) => {
  const confirmation_code = uuidv4();
  const queryUpdate = "UPDATE users SET confirmation_code=? WHERE email=?";
  const [resUpdate] = await connection.query(queryUpdate, [
    confirmation_code,
    email,
  ]);
  if (resUpdate.affectedRows > 0) {
    await sendEmailRecovery(confirmation_code, email);
    return { error: false, affectedRows: resUpdate.affectedRows };
  } else {
    return { error: true, message: "error updating user code" };
  }
};

const updatePassword = async (password, confirmation_code) => {
  const queryUpdate = "UPDATE users SET password=? WHERE confirmation_code=?";
  const encryptedPassword = await encryptPassword(password);
  const [resUpdate] = await connection.query(queryUpdate, [
    encryptedPassword,
    confirmation_code,
  ]);
  if (resUpdate.affectedRows > 0) {
    return { error: false, affectedRows: resUpdate.affectedRows };
  } else {
    return { error: true, message: "error updating user password" };
  }
};

const getUserByEmail = async (email) => {
  const querySelect = "SELECT * FROM users WHERE email=?";
  const [resSelect] = await connection.query(querySelect, [email]);
  return resSelect;
};

const sendEmailConfirm = async (confirmation_code, email) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_HOST,
      pass: process.env.PASS_EMAIL_HOST,
    },
  });
  await transport.sendMail({
    from: "Guilherme Silva <" + process.env.EMAIL_HOST + ">",
    to: email,
    subject: "E-mail de confirmação",
    html: `<body style="text-align:center;">
      <h1>E-mail de confirmação</h1>
      <h2>Por favor confirme seu e-mail clicando no link abaixo:</h2><br><br>
      <a style="background-color: #00c3ff; color: white; text-decoration: none; padding: 20px; border-radius:5px; box-shadow: 0px 0px 10px #bebebe; font-weight: bold; font-size: 20px;" href="http://localhost:5173/confirm/${confirmation_code}">Confirmar E-mail</a></body>`,
    text: "Seu serviço de e-mail não suporta html :(",
  });
};

const sendEmailRecovery = async (confirmation_code, email) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_HOST,
      pass: process.env.PASS_EMAIL_HOST,
    },
  });
  await transport.sendMail({
    from: "Guilherme Silva <" + process.env.EMAIL_HOST + ">",
    to: email,
    subject: "E-mail de recuperação de senha",
    html: `<body style="text-align:center;">
      <h1>E-mail de recuperação de senha</h1>
      <h2>Clique no link abaixo para alterar sua senha:</h2><br><br>
      <a style="background-color: #00c3ff; color: white; text-decoration: none; padding: 20px; border-radius:5px; box-shadow: 0px 0px 10px #bebebe; font-weight: bold; font-size: 20px;" href="http://localhost:5173/password_recovery/${confirmation_code}">Recuperar senha</a></body>`,
    text: "Seu serviço de e-mail não suporta html :(",
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  checkCode,
  confirmCode,
  passwordRecovery,
  updatePassword,
};
