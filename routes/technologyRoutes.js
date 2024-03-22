const router = require("express").Router();
const { technologyController } = require("../controllers");
const { isAunticated, isAuthenticatedUser } = require("../middleware/authenticate");
const { technologyValidation } = require("../utils/validations")

router.post("/add", isAunticated, isAuthenticatedUser("admin"), technologyValidation.addTechnologyValidation, technologyController.addTechnology);
router.get("/get-all", isAunticated, technologyController.getAllTechnologies);
router.put("/update", isAunticated, isAuthenticatedUser("admin"), technologyController.updateTechnology);

module.exports = router