require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");

//Import Middleware
const setMiddleware = require("./middleware/middlewares");

//Import Routes
const setRoute = require("./routes/routes");

const app = express();

//setup view engine
app.set("view engine", "ejs");
app.set("views", "views");

//Using middleware from middleware dir
setMiddleware(app);

//Using routes from routed dir
setRoute(app);

//mongodb://localhost:27017/grandcourse

const PORT = process.env.PORT || 8080;
mongoose
  .connect(
    `mongodb+srv://grandcourse:usenormal1234@cluster0.y95ry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(chalk.green("Database Connected."));
    app.listen(PORT, () => {
      console.log(chalk.green.inverse(`server is running on port ${PORT}`));
    });
  })
  .catch((e) => {
    console.log(e);
  });
