const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const mongodbStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const config = require("config");

const { bindUserWithRequest } = require("./authMiddleware");
const setLocals = require("./setLocals");
//session store
const store = new mongodbStore({
  uri: `mongodb+srv://grandcourse:usenormal1234@cluster0.y95ry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24,
});

const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: config.get("secret"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: store,
  }),
  flash(),
  bindUserWithRequest(),
  setLocals(),
];

module.exports = (app) => {
  middleware.forEach((m) => {
    app.use(m);
  });
};
