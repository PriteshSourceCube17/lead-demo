const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandling");
const HttpStatus = require("../utils/HttpStatus");
const { User } = require("../models");
const { response201, response200 } = require("../lib/response-messages/response");

// Register controller
const Register = catchAsyncError(async (req, res) => {
    const { email, password, role } = req.body;
    const errors = validationResult(req);

    if (errors.errors.length !== 0) {
        throw new ErrorHandler(errors?.errors[0]?.msg, HttpStatus.BAD_REQUEST);
    };

    const userData = await User.findOne({ email });

    if (userData) {
        throw new ErrorHandler("Email is already exists", HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ email, password: hashedPassword, role });

    return response201(res, "User registred successfully", true, [])
});

// Login controller
const Login = catchAsyncError(async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (errors.errors.length !== 0) {
        throw new ErrorHandler(errors?.errors[0]?.msg, HttpStatus.BAD_REQUEST);
    };

    const userDetails = await User.findOne({ email });

    if (userDetails) {
        const validPassword = await bcrypt.compare(password, userDetails?.password);
        if (validPassword) {
            //  { expiresIn: process.env.JWT_EXPIRES }
            const token = await jwt.sign({ _id: userDetails?.id }, process.env.JWT_SEC);
            const response = { role: userDetails?.role, token }
            return response200(res, "login successfully", true, response)

        } else {
            throw new ErrorHandler("Please enter valid password", HttpStatus.BAD_REQUEST);
        }
    } else {
        throw new ErrorHandler("Please enter registered email", HttpStatus.BAD_REQUEST);
    }
});

module.exports = { Register, Login }