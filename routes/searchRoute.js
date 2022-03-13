const router = require("express").Router();
const { searchGetController } = require("../controllers/searchController");

router.get("/", searchGetController);
module.exports = router;
