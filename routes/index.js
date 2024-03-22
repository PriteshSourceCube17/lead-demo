const express = require("express");
const authRoute = require("./authRoutes");
const salesPersonRoute = require("./salesPersonRoutes");
const techHeadRoute = require("./techHeadRoutes");
const leadRoute = require("./leadRoutes");
const technologyRoute = require("./technologyRoutes");

const router = express.Router();

router.use("/v1/auth", authRoute);
router.use("/v1/sales-person", salesPersonRoute);
router.use("/v1/tech-head", techHeadRoute);
router.use("/v1/lead", leadRoute);
router.use("/v1/technology", technologyRoute);

module.exports = router