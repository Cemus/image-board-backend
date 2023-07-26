const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const threadRoutes = require("./routes/thread.cjs");

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/threads", threadRoutes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur lancé sur ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
