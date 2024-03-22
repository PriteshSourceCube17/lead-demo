const router = require("express").Router();
const { leadController } = require("../controllers");
const { isAunticated, isAuthenticatedUser } = require("../middleware/authenticate");

router.post("/add", isAunticated, isAuthenticatedUser("sales-person"), leadController.addLeads);
// router.post("/add", isAunticated, leadController.addLeads);

router.post("/get-all", isAunticated, isAuthenticatedUser("admin", "sales-person"), leadController.getAllLeads);

module.exports = router;