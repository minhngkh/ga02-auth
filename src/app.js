const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const passport = require('passport');
const session = require('express-session');

const homeRouter = require("./components/home/router");
const authRouter = require("./components/auth/router");
const testRouter = require("./components/test/router");

// init Express app
const app = express();

// For Passport 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
})); // session secret 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// app.set("view options", { layout: "layout/default.hbs" });
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

//Models 
// var models = require("./app/models");

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/test", testRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, _) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
