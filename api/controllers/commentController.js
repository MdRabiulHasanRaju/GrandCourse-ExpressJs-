const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const { post } = require("../routes/apiRoutes");

exports.commentPostController = async (req, res, next) => {
  let { postId } = req.params;
  let { body } = req.body;

  if (!req.user) {
    return res.status(403).json({
      //403 means unauthenticated
      error: "You are not an authenticated user!",
    });
  }

  let comment = new Comment({
    post: postId,
    user: req.user._id,
    body,
    replies: [],
  });

  try {
    let createdCommnet = comment.save();
    await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: createdCommnet._id } }
    );

    let commentJSON = await Comment.findById(createdCommnet._id).populate({
      path: "user",
      select: "profilePics username",
    });

    return res.status(201).json(commentJSON); //201 means new comment created
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
};

exports.replayCommentPostController = async (req, res, next) => {
  let { commnetId } = req.params;
  let { body } = req.body;

  if (!req.user) {
    return res.status(403).json({
      //403 means unauthenticated
      error: "You are not an authenticated user!",
    });
  }

  let replay = {
    body,
    user: req.user._id,
  };

  try {
    await Comment.findOneAndUpdate(
      { _id: commnetId },
      { $push: { replies: replay } }
    );
    res.status(201).json({
      ...replay,
      profilePics: req.user.profilePics,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
};
