const express = require("express");
const routes = express.Router();

routes.post("/register");
routes.post("/login");

module.exports = routes;
