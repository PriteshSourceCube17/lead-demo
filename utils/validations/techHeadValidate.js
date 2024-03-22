const { body, param } = require("express-validator");


const addTechHeadValidation = [
    body("email").not().isEmpty().trim().withMessage("email is required."),
    body("password").not().isEmpty().trim().withMessage("password is required."),
    body("role").exists().withMessage('role is Requiered').isIn(['tech-head']).withMessage('Please enter valid role'),
    body("name").not().isEmpty().trim().withMessage("name is required."),
    body("phone").not().isEmpty().trim().withMessage("phone is required."),
    body("territory").not().isEmpty().trim().withMessage("territory is required."),
];

const updateTechHeadValidation = [
    body("tech_head_id").not().isEmpty().trim().withMessage("tech_head_id is required."),
    body("email").not().isEmpty().trim().withMessage("email is required."),
    body("name").not().isEmpty().trim().withMessage("name is required."),
    body("phone").not().isEmpty().trim().withMessage("phone is required."),
    body("territory").not().isEmpty().trim().withMessage("territory is required."),
]

module.exports = { addTechHeadValidation, updateTechHeadValidation }