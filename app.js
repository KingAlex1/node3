const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

const { secret, key } = require("./config.json");

const index = require("./routes/index");
const login = require("./routes/login");
const contact = require("./routes/contact-me");
const work = require("./routes/my-work");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "pug");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Sessions
app.use(
  session({
    secret: secret,
    key: key,
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: null
    },
    saveUninitialized: false,
    resave: false
  })
);
//Routes
app.use("/login", login);
app.use("/contact", contact);
app.use("/work", work);
app.use("/", index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;