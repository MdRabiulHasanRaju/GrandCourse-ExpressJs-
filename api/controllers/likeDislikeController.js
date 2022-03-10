const Post = require("../../models/Post");

exports.likesGetController = async (req, res, next) => {
  let { postId } = req.params;
  let liked = null;
  if (!req.user) {
    return res.status(403).json({
      //403 means unauthenticated
      error: "You are not an authenticated user!",
    });
  }
  let userId = req.user._id;
  try {
    let post = await Post.findById(postId);

    if (post.dislikes.inlcudes(userId)) {
      await Post.findByIdAndUpdate(
        { _id: postId },
        { $pull: { dislikes: userId } }
      );
    }

    if (post.likes.inlcudes(userId)) {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } }
      );
      liked = false;
    } else {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: userId } }
      );
      liked = true;
    }

    let updatedPost = await Post.findById(postId);
    res.status(200).json({
      liked,
      totolLikes: updatedPost.likes.length,
      totalDislikes: updatedPost.dislikes.length,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
};

exports.dislikeGetController = async (req, res, next) => {
  let { postId } = req.params;
  let disliked = null;
  if (!req.user) {
    return res.status(403).json({
      //403 means unauthenticated
      error: "You are not an authenticated user!",
    });
  }
  let userId = req.user._id;
  try {
    let post = await Post.findById(postId);

    if (post.likes.inlcudes(userId)) {
      await Post.findByIdAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } }
      );
    }

    if (post.dislikes.inlcudes(userId)) {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { dislikes: userId } }
      );
      disliked = false;
    } else {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { dislikes: userId } }
      );
      disliked = true;
    }

    let updatedPost = await Post.findById(postId);
    res.status(200).json({
      disliked,
      totolLikes: updatedPost.likes.length,
      totalDislikes: updatedPost.dislikes.length,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
};
