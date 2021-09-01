const router = require("express").Router();
const { check, validationResult } = require("express-validator");

router.get("/validator", (req, res, next) => {
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
    const formetter = (error) => error.msg;

    console.log(errors);
    console.log(errors.isEmpty());
    console.log(errors.array());
    console.log(errors.mapped());
    console.log(errors.formatWith(formetter).mapped());
    res.render("playground/signup", { title: "validator playground" });
  }
);

module.exports = router;
