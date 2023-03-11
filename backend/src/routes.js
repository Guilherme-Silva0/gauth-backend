const express = require("express");
const routes = express.Router();
const userMiddlewares = require("./middlewares/userMiddlewares");
const userController = require("./controller/userController");

routes.post(
  "/register",
  userMiddlewares.validateRegister,
  userController.createUser
);
routes.post("/login");

module.exports = routes;
