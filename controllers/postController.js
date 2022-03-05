const { validationResult } = require("express-validator");
const Flash = require("../utils/Flash");
const errorFormatter = require("../utils/validationErrorFormatter");

exports.createPostGetController = (req, res, next) => {
  return res.render("pages/dashboard/post/createPost", {
    title: "Create A New Post",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};
exports.createPostPostController = (req, res, next) => {
  let { title, body, tags } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);
  console.log(errors.mapped());
  console.log(title);
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/post/createPost", {
      title: "Create A New Post",
      error: errors.mapped(),
      value: { title, body, tags },
      flashMessage: Flash.getMessage(req),
    });
  } else {
    return res.render("pages/dashboard/post/createPost", {
      title: "Create A New Post",
      error: {},
      value: {},
      flashMessage: Flash.getMessage(req),
    });
  }
};
