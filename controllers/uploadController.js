const fs = require("fs");
const User = require("../models/User");
const Profile = require("../models/Profile");
exports.uploadProfilePics = async (req, res, next) => {
  if (req.file) {
    try {
      let oldProfilePics = req.user.profilepics;
      let profile = Profile.findOne({ user: req.user._id });
      let profilePics = `/uploads/${req.file.filename}`;
      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilepics: profilePics } }
        );
      }
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilepics: profilePics } }
      );
      if (oldProfilePics != "/uploads/default.png") {
        fs.unlink(`public${oldProfilePics}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      res.status(200).json({ profilePics });
    } catch (e) {
      res.status(500).json({
        profilePics: req.user.profilepics,
      });
    }
  } else {
    res.status(500).json({
      profilePics: req.user.profilepics,
    });
  }
};

exports.removeProfilePics = (req, res, next) => {
  try {
    let defaultProfilePics = "/uploads/default.png";
    let currentProfilePics = req.user.profilepics;
    fs.unlink(`public${currentProfilePics}`, async (error) => {
      let profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilepics: defaultProfilePics } }
        );
      }
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilepics: defaultProfilePics } }
      );
      res.status(200).json({
        profilePics: defaultProfilePics,
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Cannot remove profile pics",
    });
  }
};
