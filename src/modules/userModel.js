require("dotenv").config();
const nodemailer = require("nodemailer");
const connection = require("./connection");
const uuidv4 = require("uuid").v4;

const createUser = async (user) => {
  const { name, email, password } = user;
  const status_register = "new";
  const confirmation_code = uuidv4();
  const queryInsert = "INSERT INTO users VALUES(null,?,?,?,?,?)";

  const [resInsert] = await connection.query(queryInsert, [
    name,
    email,
    password,
    status_register,
    confirmation_code,
  ]);
  sendEmail(confirmation_code, email);
  return { insertId: resInsert.insertId };
};

const getUser = async (user) => {
  const querySelect = "SELECT * FROM users WHERE email=?";
  const [resSelect] = await connection.query(querySelect, [user.email]);
  return resSelect;
};

const sendEmail = (confirmation_code, email) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_HOST,
      pass: process.env.PASS_EMAIL_HOST,
    },
  });

  transport
    .sendMail({
      from: "Guilherme Silva <" + process.env.EMAIL_HOST + ">",
      to: email,
      subject: "E-mail de confirmação",
      html: `<body style="text-align:center;">
      <h1>E-mail de confirmação</h1>
      <h2>Por favor confirme seu e-mail clicando no link abaixo:</h2><br><br>
      <a style="background-color: #00c3ff; color: white; text-decoration: none; padding: 20px; border-radius:5px; box-shadow: 0px 0px 10px #bebebe; font-weight: bold; font-size: 20px;" href="http://localhost:5173/confirm/${confirmation_code}">Confirmar E-mail</a></body>`,
      text: "Seu serviço de e-mail não suporta html :(",
    })
    .then(() => console.log("email enviado"))
    .catch((err) => console.log("erro ao enviar email", err));
};

module.exports = {
  createUser,
  getUser,
};
