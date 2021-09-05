const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const Flash = require("../utils/Flash");

router.get("/validator", (req, res, next) => {
  console.log(Flash.getMessage(req));

  res.render("playground/signup", { title: "validator playground" });
});

router.post(
  "/validator",
  [
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username cannot be empty!")
      .isLength({ max: 15 })
      .withMessage("Username cannot be greater than 15 character!")
      .trim(),
    check("email")
      .isEmail()
      .withMessage("Please Provide a valid Email!")
      .trim()
      .normalizeEmail(),
    check("password").custom((value) => {
      if (value.length < 5) {
        throw new Error("password cannot be less than 5 charecters!");
      }
      return true;
    }),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password Does Not Match!");
      }
      return true;
    }),
  ],
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("fail", "There Is Some Error!");
    } else {
      req.flash("success", "There Is No Error!");
    }
    res.redirect("/playground/validator");
  }
);

module.exports = router;
