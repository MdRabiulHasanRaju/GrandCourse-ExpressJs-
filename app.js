const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);

//Import Routes
const authRoutes = require("./routes/authRoute");
const dashboardRoutes = require("./routes/dashboardRoute");

//Import Middleware
const { bindUserWithRequest } = require("./middleware/authMiddleware");
const setLocals = require("./middleware/setLocals");

//playground route TODO: Should be remove
// const validatorRoutes = require("./playground/validator");

const app = express();

//session store
const store = new mongodbStore({
  uri: "mongodb://localhost:27017/grandcourse",
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24,
});

//setup view engine
app.set("view engine", "ejs");
app.set("views", "views");

//middleware array
const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
];
app.use(middleware);

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

// app.use("/playground", validatorRoutes); //TODO: Should be remove

app.get("/", (req, res) => {
  res.json({ msg: "home" });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect("mongodb://localhost:27017/grandcourse", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected.");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
