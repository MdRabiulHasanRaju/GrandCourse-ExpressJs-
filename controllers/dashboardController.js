const Flash = require("../utils/Flash");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const errorFormatter = require("../utils/validationErrorFormatter");
exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.render("pages/dashboard/dashboard", {
        title: "My Dashboard",
        flashMessage: Flash.getMessage(req),
      });
    }
    res.redirect("/dashboard/create-profile");
  } catch (e) {
    next(e);
  }
};

exports.createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.redirect("/dashboard/edit-profile");
    }
    res.render("pages/dashboard/create-profile", {
      title: "Create Your Profile",
      flashMessage: Flash.getMessage(req),
      value: {},
      error: {},
    });
  } catch (e) {
    next(e);
  }
};

exports.createProfilePostController = async (req, res, next) => {
  let { name, title, bio, website, facebook, twitter, github } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/create-profile", {
      title: "Create Your Profile",
      error: errors.mapped(),
      value: { name, title, bio, website, facebook, twitter, github },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilepics: req.user.profilepics,
      links: {
        website: website || "",
        facebook: facebook || "",
        twitter: twitter || "",
        github: github || "",
      },
      posts: [],
      bookmarks: [],
    });

    let createdProfile = await profile.save();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profile: createdProfile._id } }
    );
    req.flash("success", "Profile Created Successfully");
    res.redirect("/dashboard");
  } catch (e) {
    next(e);
  }
};

exports.editProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.render("pages/dashboard/edit-profile", {
        title: "Edit Profile",
        flashMessage: Flash.getMessage(req),
        error: {},
        value: profile,
      });
    }
    res.redirect("/dashboard/create-profile");
  } catch (e) {
    next(e);
  }
};

exports.editProfilePostController = async (req, res, next) => {
  let { name, title, bio, website, facebook, twitter, github } = req.body;
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.render("pages/dashboard/edit-profile", {
        title: "Edit Profile",
        error: errors.mapped(),
        value: {
          name,
          title,
          bio,
          links: {
            website,
            facebook,
            twitter,
            github,
          },
        },
        flashMessage: Flash.getMessage(req),
      });
    }
    let updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          name,
          title,
          bio,
          links: {
            website,
            facebook,
            twitter,
            github,
          },
        },
      },
      { new: true }
    );
    req.flash("success", "Profile Updated Successfully");
    res.render("pages/dashboard/edit-profile", {
      title: "Edit Profile",
      error: errors.mapped(),
      value: updatedProfile,
      flashMessage: Flash.getMessage(req),
    });
  } catch (e) {
    next(e);
  }
};
