"use strict";

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const saltwaterfishRoutes = require("./routes/saltwaterfish");
const freshwaterfishRoutes = require("./routes/freshwaterfish");
const coralRoutes = require("./routes/coral");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);
app.use("/freshwaterfish", freshwaterfishRoutes);
app.use("/saltwaterfish", saltwaterfishRoutes);
app.use("/coral", coralRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
