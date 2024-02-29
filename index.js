const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Core middlewares
app.use(express.json());
app.use(cors());

// Router
app.use("/api/v1", require("./src/routes"));

app.get("/", function (req, res) {
  res.send(
    `App is running on port: ${APP_PORT} and hostname: ${APP_HOSTNAME}.`
  );
});

dotenv.config();
// Db start
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI).then(function () {
  console.log(`Connected to ${MONGODB_URI}.`);
});

// App start
const { APP_PORT, APP_HOSTNAME } = process.env;
app.listen(APP_PORT, APP_HOSTNAME, function () {
  console.log(
    `App started on port: ${APP_PORT} and hostname: ${APP_HOSTNAME}.`
  );
});
