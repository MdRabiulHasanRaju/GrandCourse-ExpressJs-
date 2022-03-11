const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");
const { explorerGetController } = require("../controllers/explorerController");

router.get("/", explorerGetController);

module.exports = router;
