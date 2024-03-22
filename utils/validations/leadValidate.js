const { body, param } = require("express-validator");

const addLeadValidation = [
    'technologies', 'source', 'priority', 'client_name', 'status', 'tech_head_id'
];

module.exports = { addLeadValidation, }