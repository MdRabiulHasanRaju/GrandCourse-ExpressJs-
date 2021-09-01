const { body } = require("express-validator");
const User = require("../../models/User");

module.exports = [
  body("username")
    .isLength({ min: 2, max: 15 })
    .withMessage("Username Should be between 2 to 15 charecters!")
    .trim()
    .custom(async (username) => {
      let user = await User.findOne({ username });
      if (user) {
        return Promise.reject("This Username is Already Used!");
      }
    }),

  body("email")
    .isEmail()
    .withMessage("Please Enter A Valid Email")
    .trim()
    .normalizeEmail()
    .custom(async (email) => {
      let userEmail = await User.findOne({ email });
      if (userEmail) {
        return Promise.reject("This Email is Already Used!");
      }
    }),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password Should be Greater Than 4 Charecters!"),

  body("confirmPassword")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Confirm Password Should be Greater Than 4 Charecters!")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Password Should Match!");
      }
      return true;
    }),
];
