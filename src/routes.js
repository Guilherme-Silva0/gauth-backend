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
  "/register/confirm/:confirmation_code",
  userMiddlewares.validateCode,
  userController.confirmCode
);

routes.post(
  "/login",
  userMiddlewares.validateLogin,
  userController.authenticateUser
);

routes.put(
  "/password_recovery",
  userMiddlewares.validatePasswordRecovery,
  userController.passwordRecovery
);

routes.put(
  "/password_recovery/:confirmation_code",
  userMiddlewares.validateUpdatePassword,
  userController.updatePassword
);

module.exports = routes;
