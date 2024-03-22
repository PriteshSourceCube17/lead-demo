const { body, param } = require("express-validator");


const registerValidation = [
    body("email").not().isEmpty().trim().withMessage("Email is required."),
    body("password").not().isEmpty().trim().withMessage("Password is required."),
    body("role").exists().withMessage('role is Requiered').isIn(['admin', 'sales-person', 'tech-head']).withMessage('Please enter valid role'),
];

const loginValidation = [
    body("email").not().isEmpty().trim().withMessage("Email is required."),
    body("password").not().isEmpty().trim().withMessage("Password is required."),
]
module.exports = { registerValidation, loginValidation }
