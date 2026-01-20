const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoute = require("./routes/auth.route.js");
const profileRoute = require("./routes/profile.route.js");
const addressRoute = require("./routes/address.route.js");
const bookingRoute = require("./routes/booking.route.js");
const offerRoute = require("./routes/nurse.offer.route.js");
const updatePphRoute = require("./routes/update.priceperhour.routes.js");
const serviceRoute = require("./routes/service.route.js");
const nurseServiceRoute = require("./routes/nurse.service.route.js");
const userDashboardRoute = require("./routes/user.dashboard.route.js");
const searchRoute = require("./routes/search.route.js");
const nurseProfileRoute = require("./routes/nurse.profile.route.js");
const nurseActiveStatusRoute = require("./routes/toggle.active.status.route.js");

app.use("/api/auth", authRoute);
app.use("/api", profileRoute);
app.use("/api", addressRoute);
app.use("/api", bookingRoute);
app.use("/api/offer", offerRoute);
app.use("/api", updatePphRoute);
app.use("/api/services", serviceRoute);
app.use("/api", nurseServiceRoute);
app.use("/api", userDashboardRoute);
app.use("/api", searchRoute);
app.use("/api", nurseProfileRoute);
app.use("/api", nurseActiveStatusRoute);

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
