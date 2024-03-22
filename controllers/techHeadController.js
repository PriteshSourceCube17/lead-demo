const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const catchAsyncError = require("../middleware/catchAsyncError");
const HttpStatus = require("../utils/HttpStatus");
const { User, TechHead } = require("../models");
const { response400, response201, response200 } = require("../lib/response-messages/response");
const ErrorHandler = require("../utils/ErrorHandling");
const { default: mongoose } = require("mongoose");

// Add tech head deatils
const addTechHeadPerson = catchAsyncError(async (req, res) => {
    const userId = req.user;
    const { email, password, role, name, phone, territory } = req.body;
    const errors = validationResult(req);

    if (errors?.errors?.length !== 0) {
        throw new ErrorHandler(errors?.errors[0]?.msg, HttpStatus.BAD_REQUEST);
    };
    const userData = await User.findOne({ email, is_Deleted: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (userData) {
        throw new ErrorHandler("Email is already exists", HttpStatus.BAD_REQUEST);
    }

    const user = await User.create({ email, password: hashedPassword, role });

    if (user) {
        await TechHead.create({ user_id: user._id, name, phone, territory, added_by: userId, updated_by: userId });

        return response201(res, "Tech Head added successfully", true, []);
    } else {
        return response400(res, "something is wrong");
    }
});

// Get all tech head details
const getAllTechHeads = catchAsyncError(async (req, res) => {
    const data = await TechHead.aggregate([
        {
            $match: { is_Deleted: false }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: "_id",
                as: 'userDetails',
                pipeline: [
                    { $project: { __v: 0, updatedAt: 0 } }
                ]
            },
        },
        {
            $unwind: "$userDetails"
        },
        { $project: { __v: 0, updatedAt: 0 } }
    ]);

    return response200(res, "fetched successfully", true, data)
});

// Get single tech head details
const getSingleTechHeadDetails = catchAsyncError(async (req, res) => {
    const { tech_head_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tech_head_id)) {
        throw new ErrorHandler("Please enter valid tech head id", HttpStatus.BAD_REQUEST);
    }

    const data = await TechHead.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(tech_head_id),
                is_Deleted: false
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: "_id",
                as: 'userDetails',
                pipeline: [
                    { $match: { is_Deleted: false } },
                    { $project: { __v: 0, updatedAt: 0 } }
                ]
            },
        },
        {
            $unwind: "$userDetails"
        },
        { $project: { __v: 0, updatedAt: 0 } }
    ]);

    if (data?.length) {
        return response200(res, "fetched successfully", true, data)
    } else {
        throw new ErrorHandler("Plesae enter valid tech head id", HttpStatus.BAD_REQUEST);
    }
});

// Update tech head deatils
const updateTechHeadDetails = catchAsyncError(async (req, res) => {
    const userId = req.user;
    const { tech_head_id, email, name, phone, territory } = req.body;
    const errors = validationResult(req);

    if (errors?.errors?.length !== 0) {
        throw new ErrorHandler(errors?.errors[0]?.msg, HttpStatus.BAD_REQUEST);
    };

    if (!mongoose.Types.ObjectId.isValid(tech_head_id)) {
        throw new ErrorHandler("Please enter valid tech head id", HttpStatus.BAD_REQUEST);
    }

    const techHeadData = await TechHead.findOne({ _id: tech_head_id });
    if (techHeadData) {
        if (email) {
            const emailIsExists = await User.findOne({ email, _id: { $ne: techHeadData?.user_id }, is_Deleted: false });
            if (emailIsExists) {
                throw new ErrorHandler("Email is already exists", HttpStatus.BAD_REQUEST);
            }
            const userData = await User.findOne({ _id: techHeadData.user_id });
            userData.email = email;
            await userData.save();
        }

        techHeadData.name = name;
        techHeadData.phone = phone;
        techHeadData.territory = territory;
        techHeadData.updated_by = userId;

        await techHeadData.save();

        return response200(res, "Details updated successfully", true, [])
    } else {
        return response400(res, "Please enter valid tech head id")
    }
});

// Remove tech head details
const removeTechHead = catchAsyncError(async (req, res) => {
    const userId = req.user;
    const { tech_head_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tech_head_id)) {
        throw new ErrorHandler("Please enter valid tech head id", HttpStatus.BAD_REQUEST);
    }

    const techHeadData = await TechHead.findOne({ _id: tech_head_id });
    if (techHeadData) {

        const userData = await User.findOne({ _id: techHeadData?.user_id });
        userData.is_Deleted = true;
        techHeadData.is_Deleted = true;
        techHeadData.updated_by = userId;

        await userData.save();
        await techHeadData.save();

        return response200(res, "Details removed successfully", true, [])
    } else {
        return response400(res, "Please enter valid tech head id")
    }
});

module.exports = { addTechHeadPerson, getAllTechHeads, getSingleTechHeadDetails, updateTechHeadDetails, removeTechHead }