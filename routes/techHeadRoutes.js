const router = require("express").Router();
const { techHeadController } = require("../controllers");
const { isAunticated, isAuthenticatedUser } = require("../middleware/authenticate");
const { techHeadValidation } = require("../utils/validations");

router.post("/add", isAunticated, isAuthenticatedUser("admin"), techHeadValidation.addTechHeadValidation, techHeadController.addTechHeadPerson);
router.post("/get-all", isAunticated, isAuthenticatedUser("admin"), techHeadController.getAllTechHeads);
router.get("/get-single/:tech_head_id", isAunticated, isAuthenticatedUser("admin"), techHeadController.getSingleTechHeadDetails);
router.put("/update", isAunticated, isAuthenticatedUser("admin"), techHeadValidation.updateTechHeadValidation, techHeadController.updateTechHeadDetails);
router.delete("/remove/:tech_head_id", isAunticated, isAuthenticatedUser("admin"), techHeadController.removeTechHead);

module.exports = router;