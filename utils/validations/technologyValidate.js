const { body, param } = require("express-validator");

const addTechnologyValidation = [
    body("technologyName").not().isEmpty().trim().withMessage("technologyName is required."),
];

module.exports = { addTechnologyValidation, }