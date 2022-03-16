const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadProfilePics,
  removeProfilePics,
  postImageUploadController,
} = require("../controllers/uploadController");

router.post(
  "/profilePics",
  isAuthenticated,
  upload.single("profilePics"),
  uploadProfilePics
);
router.post(
  "/postImage",
  isAuthenticated,
  upload.single("post-image"),
  postImageUploadController
);

router.delete("/profilePics", isAuthenticated, removeProfilePics);

module.exports = router;
