const { body } = require("express-validator");
const profile = require("../../models/Profile");
const validator = require("validator");
const linkValidator = (value) => {
  if (value) {
    if (!validator.isURL(value)) {
      throw new Error("Please provide valid URL!");
    }
  }
  return true;
};
module.exports = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("Name cannot be empty!")
    .isLength({ max: 30 })
    .withMessage("Name should be less then 30 character!")
    .trim(),
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title cannot be empty!")
    .isLength({ max: 100 })
    .withMessage("Title cannot be more than 100 chacters!")
    .trim(),
  body("bio")
    .not()
    .isEmpty()
    .withMessage("Bio cannot be empty!")
    .isLength({ max: 500 })
    .withMessage("Bio cannot be more than 500 chacters!")
    .trim(),
  body("website").custom(linkValidator),
  body("facebook").custom(linkValidator),
  body("twitter").custom(linkValidator),
  body("github").custom(linkValidator),
];
