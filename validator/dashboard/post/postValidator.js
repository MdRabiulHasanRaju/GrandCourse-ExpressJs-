const { body } = require("express-validator");
const cheerio = require("cheerio");
module.exports = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title Cannot Be Empty!")
    .isLength({ max: 100 })
    .withMessage("Title Cannot Be Greater Than 100 chars")
    .trim(),
  body("body")
    .not()
    .isEmpty()
    .withMessage("Body Cannot Be Empty!")
    .custom((value) => {
      let node = cheerio.load(value);
      let text = node.text();
      if (text.length > 5000) {
        throw new Error("Body Cannot Be Greater Than 5000 chars ");
      }
      return true;
    }),
];
