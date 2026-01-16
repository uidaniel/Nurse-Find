const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoute = require("./routes/auth.route.js");
const profileRoute = require("./routes/profile.route.js");
app.use("/api/auth", authRoute);
app.use("/api", profileRoute);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongo is up and running");
    app.listen(PORT, () => {
      console.log(`server is running on PORT ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
