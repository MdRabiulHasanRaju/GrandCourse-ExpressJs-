const authRoutes = require("./authRoute");
const dashboardRoutes = require("./dashboardRoute");
//const playgroundRoute = require("../playground/play");
const uploadRoute = require("./uploadRoute");
const postRoute = require("./postRoute");
const explorerRoute = require("./explorerRoute");
const searchRoute = require("./searchRoute");
const authorRoute = require("./authorRoute");
const errorRoute = require("./errorRoute");
const chalk = require("chalk");

const apiRoutes = require("../api/routes/apiRoutes");

const routes = [
  {
    path: "/auth",
    handler: authRoutes,
  },
  {
    path: "/uploads",
    handler: uploadRoute,
  },
  {
    path: "/dashboard",
    handler: dashboardRoutes,
  },
  {
    path: "/posts",
    handler: postRoute,
  },
  {
    path: "/api",
    handler: apiRoutes,
  },
  {
    path: "/explorer",
    handler: explorerRoute,
  },
  {
    path: "/search",
    handler: searchRoute,
  },
  {
    path: "/author",
    handler: authorRoute,
  },
  {
    path: "/error",
    handler: errorRoute,
  },
  // {
  //   path: "/playground",
  //   handler: playgroundRoute,
  // },

  {
    path: "/",
    handler: (req, res) => {
      // res.json({ msg: "home" });
      res.redirect("/dashboard");
    },
  },

  {
    path: "",
    handler: (req, res, next) => {
      const err = new Error("404 Page Not Found!");
      err.status = 404;
      next(err);
    },
  },

  {
    path: "",
    handler: (err, req, res, next) => {
      if (err.status == 404) {
        // res.json({
        //   message: "404 Page Not Found!",
        // });
        res.redirect("/error/404");
      } else {
        //for 500 internal server error
        console.log(chalk.red.inverse(err.message));
        console.log(err);
        // res.json({
        //   message: "Internal Server Error!",
        // });
        res.redirect("/error/500");
      }
    },
  },
];

module.exports = (app) => {
  routes.forEach((r) => {
    if (r.path == "/") {
      app.get(r.path, r.handler);
    } else {
      app.use(r.path, r.handler);
    }
  });
};
