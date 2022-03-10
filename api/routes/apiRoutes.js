const router = require("express").Router();
const { isAuthenticated } = require("../../middleware/authMiddleware");
const {
  commentPostController,
  replayCommentPostController,
} = require("../controllers/commentController");
const {
  likesGetController,
  dislikeGetController,
} = require("../controllers/likeDislikeController");
const { bookmarksGetController } = require("../controllers/bookmarkController");

router.post("/comments/:postId", isAuthenticated, commentPostController);
router.post(
  "/comments/replies/:commentId",
  isAuthenticated,
  replayCommentPostController
);
router.get("/likes/:postId", isAuthenticated, likesGetController);
router.get("/dislikes/:postId", isAuthenticated, dislikeGetController);
router.get("/bookmarks/:postId", isAuthenticated, bookmarksGetController);
module.exports = router;
