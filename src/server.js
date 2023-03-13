const express = require("express");
require("dotenv").config();
const cors = require("cors");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(PORT, () => console.log("server is running in port", PORT));
