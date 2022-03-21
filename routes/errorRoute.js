const router = require("express").Router()
const {errorPageNotFoundGetController,errorInternalServerGetController} = require("../controllers/errorController")

router.get("/404",errorPageNotFoundGetController)
router.get("/500",errorInternalServerGetController)
module.exports = router;