const User = require("../models/User");
exports.bindUserWithRequest = () => {
  return async (req, res, next) => {
    if (!req.session.LoggedIn) {
      return next();
    }
    try {
      let user = await User.findById(req.session.user._id);
      req.user = user;
      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
};

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.LoggedIn) {
    return res.redirect("/auth/login");
  } else {
    next();
  }
};

exports.isUnAuthenticated = (req, res, next) => {
  if (req.session.LoggedIn) {
    return res.redirect("/dashboard");
  }
  return next();
};
