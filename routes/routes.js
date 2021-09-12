const authRoutes = require("./authRoute");
const dashboardRoutes = require("./dashboardRoute");

const routes = [
  {
    path: "/auth",
    handler: authRoutes,
  },

  {
    path: "/dashboard",
    handler: dashboardRoutes,
  },

  {
    path: "/",
    handler: (req, res) => {
      res.json({ msg: "home" });
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
        res.json({
          message: "404 Page Not Found!",
        });
      } else {
        //for 500 internal server error
        console.log(chalk.red.inverse(err.message));
        console.log(err);
        res.json({
          message: "Internal Server Error!",
        });
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
