const Profile = require("../../models/Profile");

exports.bookmarksGetController = async (req, res, next) => {
  let postId = req.params.postId;

  if (!req.user) {
    return res.status(403).json({
      //403 means unauthenticated
      error: "You are not an authenticated user!",
    });
  }
  let userId = req.user._id;
  let bookmark = null;
  try {
    let profile = await Profile.findOne({ user: userId });
    if (profile.bookmarks.includes(postId)) {
      await Profile.findByIdAndUpdate(
        { user: userId },
        { $pull: { bookmarks: postId } }
      );
      bookmark = false;
    } else {
      await Profile.findByIdAndUpdate(
        { user: userId },
        { $push: { bookmarks: postId } }
      );
      bookmark = false;
    }

    res.status(200).json({
      bookmark,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
};
