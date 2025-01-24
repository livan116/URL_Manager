const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/user.route")
const urlRoutes = require('./Routes/url.routes')

dotenv.config();
const app = express();

app.use(express.json());

//for user routes

app.use('/api/user',userRoutes);
app.use('/api/url', urlRoutes);

app.get("/", (req, res) => {
  console.log("backend for final eval");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("mongo db connected"))
    .catch((err) => console.log("mongo db error:", err));
});
