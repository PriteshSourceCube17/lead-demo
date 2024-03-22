const { body, param } = require("express-validator");


const addSalesPersonValidation = [
    body("email").not().isEmpty().trim().withMessage("email is required."),
    body("password").not().isEmpty().trim().withMessage("password is required."),
    body("role").exists().withMessage('role is Requiered').isIn(['sales-person']).withMessage('Please enter valid role'),
    body("name").not().isEmpty().trim().withMessage("name is required."),
    body("phone").not().isEmpty().trim().withMessage("phone is required."),
    body("territory").not().isEmpty().trim().withMessage("territory is required."),
];

const updateSalesPersonValidation = [
    body("sales_person_id").not().isEmpty().trim().withMessage("sales_person_id is required."),
    body("email").not().isEmpty().trim().withMessage("email is required."),
    body("name").not().isEmpty().trim().withMessage("name is required."),
    body("phone").not().isEmpty().trim().withMessage("phone is required."),
    body("territory").not().isEmpty().trim().withMessage("territory is required."),
]

module.exports = { addSalesPersonValidation, updateSalesPersonValidation }