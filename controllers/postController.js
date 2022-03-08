const { validationResult } = require("express-validator");
const readingTime = require("reading-time");
const Flash = require("../utils/Flash");
const errorFormatter = require("../utils/validationErrorFormatter");

const Post = require("../models/Post");
const Profile = require("../models/Profile");

exports.createPostGetController = async (req, res, next) => {
  return res.render("pages/dashboard/post/createPost", {
    title: "Create A New Post",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.createPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/post/createPost", {
      title: "Create A New Post",
      error: errors.mapped(),
      value: { title, body, tags },
      flashMessage: Flash.getMessage(req),
    });
  }

  if (tags) {
    tags = tags.split(",");
    tags = tags.map((t) => t.trim());
  }

  let readTime = readingTime(body).text;
  let post = new Post({
    title,
    body,
    tags,
    author: req.user._id,
    thumbnail: "",
    readTime,
    likes: [],
    dislikes: [],
    comments: [],
  });

  if (req.file) {
    post.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    let createdPost = await post.save();
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: { posts: createdPost._id },
      }
    );
    req.flash("success", "Post Created Successfully");
    return res.redirect(`/posts/edit/${createdPost._id}`);
  } catch (e) {
    next(e);
  }
};

exports.editPostGetController = async (req, res, next) => {
  let postId = req.params.postId;
  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });
    if (!post) {
      let error = new Error("404 Page Not Found!");
      error.status = 404;
      throw error;
    }
    res.render("pages/dashboard/post/editPost", {
      title: "Edit Your Post",
      error: {},
      post,
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};

exports.editPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body;
  let postId = req.params.postId;
  let errors = validationResult(req).formatWith(errorFormatter);

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });
    if (!post) {
      let error = new Error("404 Page Not Found!");
      error.status = 404;
      throw error;
    }

    if (!errors.isEmpty()) {
      return res.render("pages/dashboard/post/editPost", {
        title: "Edit Your Post",
        error: errors.mapped(),
        post,
        flashMessage: Flash.getMessage(req),
      });
    }

    if (tags) {
      tags = tags.split(",");
      tags = tags.map((t) => t.trim());
    }

    let thumbnail = post.thumbnail;
    if (req.file) {
      thumbnail = `/uploads/${req.file.filename}`;
    }

    await Post.findOneAndUpdate(
      { id: post._id },
      {
        $set: {
          title,
          body,
          tags,
          thumbnail,
        },
      },
      { new: true }
    );
    req.flash("success", "Post Updated Successfully...");
    res.redirect("/posts/edit/" + post._id);
  } catch (e) {
    next(e);
  }
};
