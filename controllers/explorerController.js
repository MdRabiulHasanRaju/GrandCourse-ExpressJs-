const Flash = require("../utils/Flash");
const Post = require("../models/Post");
const Profile = require("../models/Profile");
const User = require("../models/User");
const moment = require("moment");

function genDate(days) {
  let date = moment().subtract(days, "days");
  return date.toDate();
}

function genarateFilterObject(filter) {
  let filterObj = {};
  let order = 1;
  switch (filter) {
    case "week": {
      filterObj: {
        createdAt: {
          $gt: genDate(7);
        }
      }
      order = -1;
      break;
    }
    case "month": {
      filterObj: {
        createdAt: {
          $gt: genDate(30);
        }
      }
      order = -1;
      break;
    }
    case "all": {
      order = -1;
      break;
    }
  }
  return {
    filterObj,
    order,
  };
}
exports.explorerGetController = async (req, res, next) => {
  let filter = req.query.filter || "latest";
  let { filterObj, order } = genarateFilterObject(filter.toLowerCase());
  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = 2;

  try {
    let profile = {};
    let userPosts = {};
    let posts = await Post.find(filterObj)
      .populate({ path: "author", select: "username" })
      .sort(order == 1 ? "-createdAt" : "createdAt")
      .skip(currentPage * itemPerPage - itemPerPage)
      .limit(itemPerPage);

    let totalPost = await Post.countDocuments();
    let totalPage = totalPost / itemPerPage;

    let bookmarks = [];
    if (req.user) {
      userPosts = await User.findOne({ _id: req.user._id }).populate({
        path: "profile",
        populate: {
          path: "posts",
        },
      });
      profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        bookmarks = profile.bookmarks;
      }
      // else {
      //   res.redirect("/dashboard/create-profile");
      // }
    }

    res.render("pages/explorer/explorer", {
      title: "Explore All Post",
      filter,
      posts,
      itemPerPage,
      currentPage,
      totalPage,
      bookmarks,
      profile,
      userPosts,
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};

exports.singlePostGetController = async (req, res, next) => {
  let { postId } = req.params;
  try {
    let post = await Post.findById(postId)
      .populate({
        path: "author",
        select: "username profilepics",
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies.user",
          select: "username profilepics",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilepics",
        },
      });

    //res.json(post);
    if (!post) {
      let error = new Error("Page Not Found!");
      error.status = 404;
      throw error;
    }

    let bookmarks = [];
    if (req.user) {
      let profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        bookmarks = profile.bookmarks;
      }
      //  else {
      //   res.redirect("/dashboard/create-profile");
      // }
    }

    res.render("pages/explorer/singlePost", {
      title: post.title,
      flashMessage: Flash.getMessage(req),
      post,
      bookmarks,
    });
  } catch (e) {
    next(e);
  }
};

exports.explorerProfileSidebar = async (req, res, next) => {};
