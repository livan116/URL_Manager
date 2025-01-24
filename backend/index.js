const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/user.route")
const urlRoutes = require('./Routes/url.routes')
const redirectRoutes = require('./Routes/redirect.routes')

dotenv.config();
const app = express();

app.use(express.json());

//for user routes

app.use('/api/user',userRoutes);
app.use('/api/url', urlRoutes);
app.use('/',redirectRoutes)

app.get("/", (req, res) => {
  console.log("backend for final eval");
  res.send("Link Managment");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0' , () => {
  console.log(`Server is running on PORT: ${PORT}`);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("mongo db connected"))
    .catch((err) => console.log("mongo db error:", err));
});
