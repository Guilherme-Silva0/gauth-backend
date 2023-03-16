const express = require("express");
const routes = express.Router();
const userMiddlewares = require("./middlewares/userMiddlewares");
const userController = require("./controller/userController");

routes.post(
  "/register",
  userMiddlewares.validateRegister,
  userController.createUser
);

routes.put(
  "/register/:confirmation_code",
  userMiddlewares.validateCode,
  userController.confirmCode
);

routes.post("/login", userMiddlewares.validateLogin);

module.exports = routes;
