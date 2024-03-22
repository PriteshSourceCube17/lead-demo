const router = require("express").Router();
const { salesPersonController } = require("../controllers");
const { isAunticated, isAuthenticatedUser } = require("../middleware/authenticate");
const { salesPersonValidation } = require("../utils/validations")

// This Route is access for the admin
router.post("/add", isAunticated, isAuthenticatedUser("admin"), salesPersonValidation.addSalesPersonValidation, salesPersonController.addSalesPerson);
router.post("/get-all", isAunticated, isAuthenticatedUser("admin"), salesPersonController.getAllSalesPersonList);
router.get("/get-single/:sales_person_id", isAunticated, isAuthenticatedUser("admin"), salesPersonController.getSingleSalesPersonDetails);
router.put("/update", isAunticated, isAuthenticatedUser("admin"), salesPersonValidation.updateSalesPersonValidation, salesPersonController.updateSalesPersonDetails);
router.delete("/remove/:sales_person_id", isAunticated, isAuthenticatedUser("admin"), salesPersonController.removeSalesPerson);

module.exports = router;