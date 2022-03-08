const router = require("express").Router();
const postValidator = require("../validator/dashboard/post/postValidator");
const upload = require("../middleware/uploadMiddleware");
const { isAuthenticated } = require("../middleware/authMiddleware");
const {
  createPostGetController,
  createPostPostController,
  editPostGetController,
  editPostPostController,
  deletePostGetController,
  AllPostGetController,
} = require("../controllers/postController");
router.get("/create", isAuthenticated, createPostGetController);
router.post(
  "/create",
  isAuthenticated,
  upload.single("post-thumbnail"),
  postValidator,
  createPostPostController
);

router.get("/edit/:postId", isAuthenticated, editPostGetController);
router.post(
  "/edit/:postId",
  isAuthenticated,
  upload.single("post-thumbnail"),
  postValidator,
  editPostPostController
);

router.get("/delete/:postId", isAuthenticated, deletePostGetController);

router.get("/", isAuthenticated, AllPostGetController);
module.exports = router;
