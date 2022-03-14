const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const errorFormatter = require("../utils/validationErrorFormatter");
const Flash = require("../utils/Flash");

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", {
    title: "Create A New Account",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
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
      flashMessage: Flash.getMessage(req),
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
    next(error);
  }
};

exports.loginGetController = (req, res, next) => {
  res.render("pages/auth/login", {
    title: "Login To Your Account",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
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
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.render("pages/auth/login", {
        title: "Login To Your Account",
        error: { loginFail: "Invalid Credential!" },
        value: { email, password },
        flashMessage: Flash.getMessage(req),
      });
    }
    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("fail", "Invalid Credential!");
      return res.render("pages/auth/login", {
        title: "Login To Your Account",
        error: { loginFail: "Invalid Credential!" },
        value: { email, password },
        flashMessage: Flash.getMessage(req),
      });
    }
    req.session.LoggedIn = true;
    req.session.user = user;
    req.session.save((e) => {
      if (e) {
        return next(e);
      }
      req.flash("success", "Successfully Logged In");
      return res.redirect("/dashboard");
    });
  } catch (e) {
    next(e);
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy((e) => {
    if (e) {
      return next(e);
    }
    return res.redirect("/auth/login");
  });
};

exports.changePasswordGetController = async (req, res, next) => {
  res.render("pages/auth/changepassword", {
    title: "Change Password",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};
exports.changePasswordPostController = async (req, res, next) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword != confirmPassword) {
    req.flash("fail", "Password Does Not Matched!");
    return res.redirect("/auth/changepassword");
  }

  if (oldPassword.length == 0) {
    req.flash("fail", "Old Password Cannot Be Empty!");
    return res.redirect("/auth/changepassword");
  }

  if ((newPassword.length || confirmPassword.length) < 5) {
    req.flash("fail", "Password Should be Greater Than 4 Charecters!");
    return res.redirect("/auth/changepassword");
  }

  try {
    let match = await bcrypt.compare(oldPassword, req.user.password);

    if (!match) {
      req.flash("fail", "Old Password Does Not Matched!");
      return res.redirect("/auth/changepassword");
    }

    let hash = await bcrypt.hash(newPassword, 11);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { password: hash } }
    );
    req.flash("success", "Password Changed Successfully");
    return res.redirect("/auth/changepassword");
  } catch (e) {
    next(e);
  }
};
