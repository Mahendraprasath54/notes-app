require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

mongoose.connect(config.connectionString)
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send({ data: "hello" });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(port, () => {
  console.log(`App is listening to the port${port}`);
});

module.exports = app;
