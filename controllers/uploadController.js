const User = require("../models/User");
const Profile = require("../models/Profile");
exports.uploadProfilePics = async (req, res, next) => {
  if (req.file) {
    try {
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
