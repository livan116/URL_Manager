const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')
const userRoutes = require("./Routes/user.route");
const urlRoutes = require("./Routes/url.routes");
const redirectRoutes = require("./Routes/redirect.routes");
const device = require("express-device");

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  device.capture({
    parseUserAgent: true,
  })
);
app.use(cors())

//for user routes

app.use("/api/user", userRoutes);
app.use("/api/url", urlRoutes);
app.use("/", redirectRoutes);

device.enableViewRouting(app);

app.get("/", (req, res) => {
  res.send("Hi to " + req.device.type.toUpperCase() + " User" + req.ip);

});

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT: ${PORT}`);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("mongo db connected"))
    .catch((err) => console.log("mongo db error:", err));
});
