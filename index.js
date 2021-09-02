const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["https://rohith-taskboard.netlify.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/refresh_token", cookieParser());
app.use("/api/refresh_token", require("./routes/refresh_token"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

const PORT = process.env.PORT || 5000;

// console.log(process.env.DB_URI);

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`App is running on port ${PORT}`))
  );
