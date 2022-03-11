const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");
const {
  explorerGetController,
  singlePostGetController,
} = require("../controllers/explorerController");

router.get("/:postId", singlePostGetController);
router.get("/", explorerGetController);

module.exports = router;
