const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const catchAsyncError = require("../middleware/catchAsyncError");
const HttpStatus = require("../utils/HttpStatus");
const { User, SalesPerson } = require("../models");
const { response400, response201, response200 } = require("../lib/response-messages/response");
const ErrorHandler = require("../utils/ErrorHandling");
const { default: mongoose } = require("mongoose");

// Add sales person deatils
const addSalesPerson = catchAsyncError(async (req, res) => {
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
        await SalesPerson.create({ user_id: user._id, name, phone, territory, added_by: userId, updated_by: userId });

        return response201(res, "Sales person added successfully", true, []);
    } else {
        return response400(res, "something is wrong");
    }
});

// Get all sales person details
const getAllSalesPersonList = catchAsyncError(async (req, res) => {
    const data = await SalesPerson.aggregate([
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

// Get single sales person details
const getSingleSalesPersonDetails = catchAsyncError(async (req, res) => {
    const { sales_person_id } = req.params;

    const data = await SalesPerson.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(sales_person_id) }
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

    if (data?.length) {
        return response200(res, "fetched successfully", true, data)
    } else {
        throw new ErrorHandler("Plesae enter valid sales peroson id", HttpStatus.BAD_REQUEST);
    }
});

// Update sales person deatils
const updateSalesPersonDetails = catchAsyncError(async (req, res) => {
    const userId = req.user;
    const { sales_person_id, email, name, phone, territory } = req.body;
    const errors = validationResult(req);

    if (errors?.errors?.length !== 0) {
        throw new ErrorHandler(errors?.errors[0]?.msg, HttpStatus.BAD_REQUEST);
    };

    if (!mongoose.Types.ObjectId.isValid(sales_person_id)) {
        throw new ErrorHandler("Please enter valid sales person id", HttpStatus.BAD_REQUEST);
    }

    const salesPersonData = await SalesPerson.findOne({ _id: sales_person_id });
    if (salesPersonData) {
        if (email) {
            const emailIsExists = await User.findOne({ email, _id: { $ne: salesPersonData.user_id }, is_Deleted: false });
            if (emailIsExists) {
                throw new ErrorHandler("Email is already exists", HttpStatus.BAD_REQUEST);
            }
            const userData = await User.findOne({ _id: salesPersonData.user_id });
            userData.email = email;
            await userData.save();
        }

        salesPersonData.name = name;
        salesPersonData.phone = phone;
        salesPersonData.territory = territory;
        salesPersonData.updated_by = userId;

        await salesPersonData.save();

        return response200(res, "Details updated successfully", true, [])
    } else {
        return response400(res, "Please enter valid sales person id")
    }
});

// Remove sales person details
const removeSalesPerson = catchAsyncError(async (req, res) => {
    const userId = req.user;
    const { sales_person_id } = req.params;

    const salesPersonData = await SalesPerson.findOne({ _id: sales_person_id });
    if (salesPersonData) {

        const userData = await User.findOne({ _id: salesPersonData?.user_id });
        userData.is_Deleted = true;
        salesPersonData.is_Deleted = true;
        salesPersonData.updated_by = userId;

        await userData.save();
        await salesPersonData.save();

        return response200(res, "Details removed successfully", true, [])
    } else {
        return response400(res, "Please enter valid sales person id")
    }
});

module.exports = { addSalesPerson, getAllSalesPersonList, getSingleSalesPersonDetails, updateSalesPersonDetails, removeSalesPerson }