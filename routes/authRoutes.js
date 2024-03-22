const router = require("express").Router();
const { authController } = require("../controllers")
const { authValidation } = require("../utils/validations")

router.post("/sign-up", authValidation.registerValidation, authController.Register);
router.post("/sign-in", authValidation.loginValidation, authController.Login);

module.exports = router;