const { validationResult } = require("express-validator");
const catchAsyncError = require("../middleware/catchAsyncError");
const HttpStatus = require("../utils/HttpStatus");
const ErrorHandler = require("../utils/ErrorHandling");
const { response400, response201, response200 } = require("../lib/response-messages/response");
const { default: mongoose } = require("mongoose");
const { Technology } = require("../models");

// add technology by admin
const addTechnology = catchAsyncError(async (req, res) => {
    const userId = req.user;
    const { technologyName } = req.body;
    const errors = validationResult(req);

    if (errors?.errors?.length !== 0) {
        throw new ErrorHandler(errors?.errors[0]?.msg, HttpStatus.BAD_REQUEST);
    };

    await Technology.create({ technologyName, added_by: userId });

    return response201(res, "Technology added successfully", true, []);
});

// get all technology list
const getAllTechnologies = catchAsyncError(async (req, res) => {
    const data = await Technology.find({ is_Deleted: false, status: true });

    return response200(res, "fetched successfully", true, data)
});

// update technology details by admin
const updateTechnology = catchAsyncError(async (req, res) => {
    const { technology_id, technologyName, status, is_Deleted } = req.body;

    if (!mongoose.Types.ObjectId.isValid(technology_id)) {
        return response400(res, "Please enter valid technology id.")
    }

    const data = await Technology.findOne({
        _id: technology_id
    });

    if (data) {
        data.technologyName = technologyName ? technologyName : data.technologyName;
        data.status = status === false ? status : data.status;
        data.is_Deleted = is_Deleted === true ? is_Deleted : data.is_Deleted;

        await data.save();
        return response200(res, "updated successfully", true, []);

    } else {
        return response400(res, "Technology details not found")
    }
});

module.exports = { addTechnology, getAllTechnologies, updateTechnology }