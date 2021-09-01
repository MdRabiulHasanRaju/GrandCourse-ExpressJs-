const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const errorFormatter = require("../utils/validationErrorFormatter");

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", {
    title: "Create A New Account",
    error: {},
    value: {},
  });
};

exports.signupPostController = async (req, res, next) => {
  let { username, email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/auth/signup", {
      title: "Create A New Account",
      error: errors.mapped(),
      value: { username, email, password },
    });
  }

  try {
    let hashedPassword = await bcrypt.hash(password, 11);

    let user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.loginGetController = (req, res, next) => {
  res.render("pages/auth/login", {
    title: "Login To Your Account",
    error: {},
    value: {},
  });
};

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    return res.render("pages/auth/login", {
      title: "Login To Your Account",
      error: errors.mapped(),
      value: { email, password },
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.render("pages/auth/login", {
        title: "Login To Your Account",
        error: { loginFail: "Invalid Credential!" },
        value: { email, password },
      });
    }
    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("pages/auth/login", {
        title: "Login To Your Account",
        error: { loginFail: "Invalid Credential!" },
        value: { email, password },
      });
    }
    req.session.LoggedIn = true;
    req.session.user = user;
    req.session.save((e) => {
      if (e) {
        console.log(e);
        return next(e);
      }
      res.redirect("/dashboard");
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy((e) => {
    if (e) {
      console.log(e);
      return next(e);
    }
    return res.redirect("/auth/login");
  });
};
