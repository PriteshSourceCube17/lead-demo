const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { v4: uuidv4 } = require('uuid');

const { response400, response201, response200, response500 } = require("../lib/response-messages/response");
const { addLeadValidation } = require("../utils/validations/leadValidate");
const ErrorHandler = require("../utils/ErrorHandling");
const { Lead, SalesPerson } = require("../models");
const catchAsyncError = require("../middleware/catchAsyncError");
const { uploadFile } = require("../lib/uploader/upload");
const HttpStatus = require("../utils/HttpStatus");

// Add leads by the sales person
const addLeads = catchAsyncError(async (req, res) => {
    upload.fields([
        { name: 'technologies', maxCount: 1 },
        { name: 'source', maxCount: 1 },
        { name: 'client_name', maxCount: 1 },
        { name: 'priority', maxCount: 1 },
        { name: 'status', maxCount: 1 },
        { name: 'tech_head_id', maxCount: 1 },
        { name: 'notes', maxCount: 1 },
        { name: 'comments', maxCount: 1 },
        { name: 'attachment', maxCount: 1 },
    ])(req, res, async (err) => {
        if (err) {
            return response500(res, "Something is wrong");
        }

        const Id = req.user;
        const salesPersonData = await SalesPerson.findOne({ user_id: Id })
        const { technologies, source, client_name, priority, status, tech_head_id, notes, comments } = req.body;

        const validation = addLeadValidation.filter(field => !req.body[field]);
        let checkPriority = ['high', 'medium', 'low'];
        let validTechnoloies;
        if (technologies.length) {
            technologies.some((val) => {
                if (!mongoose.Types.ObjectId.isValid(val)) {
                    validTechnoloies = false;
                }
            })
        }

        if (validation.length > 0) return response400(res, `${validation.join(', ')} is required`);
        if (!checkPriority.includes(priority)) return response400(res, `${priority} priority is not allowed`);
        if (!mongoose.Types.ObjectId.isValid(tech_head_id)) return response400(res, "Please enter valid tech head id", HttpStatus.BAD_REQUEST);
        if (validTechnoloies === false) return response400(res, "Please enter valid technology id", HttpStatus.BAD_REQUEST);

        let imgPath = "";
        if (req.files.attachment) {
            const { mimetype, buffer } = req?.files?.attachment[0];
            const img = mimetype.split('/');
            const extension = img[1].toLowerCase();

            // if (!['jpeg', 'jpg', 'png'].includes(extension)) {
            //     return res.status(400).json({ message: `${extension} is not allowed..`, errorCode: 30002 });
            // }

            const fileName = (req.files.attachment[0].originalname = uuidv4() + "." + extension);
            const uploadImgRes = await uploadFile(buffer, fileName, "lead-attachments", extension);
            // imgPath = uploadImgRes.imageUrl;
            imgPath = fileName;
        }

        await Lead.create({ sales_person_id: salesPersonData._id, technologies, source, client_name, priority, status, tech_head_id, notes, comments, attachment: imgPath, added_by: salesPersonData._id });

        return response201(res, "Lead added successfully", true, []);
    });
});

// get all leads for admin
const getAllLeads = catchAsyncError(async (req, res) => {
    const data = await Lead.aggregate([
        {
            $lookup: {
                from: 'sales-people',
                localField: 'sales_person_id',
                foreignField: "_id",
                as: 'salesPersonDetails',
                pipeline: [
                    { $project: { __v: 0, updatedAt: 0, updated_by: 0, } }
                ]
            },
        },
        {
            $unwind: "$salesPersonDetails"
        },
        {
            $lookup: {
                from: 'users',
                localField: 'salesPersonDetails.user_id',
                foreignField: "_id",
                as: 'salesPersonDetails.userDetails',
                pipeline: [
                    { $project: { __v: 0, updatedAt: 0 } }
                ]
            },
        },
        {
            $unwind: "$salesPersonDetails.userDetails"
        },
        {
            $lookup: {
                from: 'technologies',
                localField: 'technologies',
                foreignField: "_id",
                as: 'technologieDetails',
                pipeline: [
                    { $project: { __v: 0, updatedAt: 0, updated_by: 0, is_Deleted: 0, status: 0, } }
                ]
            },
        },
        { $project: { __v: 0, updatedAt: 0 } }
    ]);
    return response200(res, "fetched successfully", true, data);
});

// update lead details
const updateLead = catchAsyncError(async (req, res) => {
    const Id = req.user;
    const salesPersonData = await SalesPerson.findOne({ user_id: Id })
    upload.fields([
        { name: 'technologies', maxCount: 1 },
        { name: 'source', maxCount: 1 },
        { name: 'client_name', maxCount: 1 },
        { name: 'priority', maxCount: 1 },
        { name: 'status', maxCount: 1 },
        { name: 'tech_head_id', maxCount: 1 },
        { name: 'notes', maxCount: 1 },
        { name: 'comments', maxCount: 1 },
        { name: 'attachment', maxCount: 1 },
    ])(req, res, async (err) => {
        if (err) {
            return response500(res, "Something is wrong");
        }
        const { lead_id, technologies, source, client_name, priority, status, tech_head_id, notes, comments } = req.body;

        const leadData = await Lead.findOne({ _id: lead_id });

        if (leadData) {

            if (req.files.attachment) {

                // await fs.unlink(pdfPath, (err) => {
                //     if (err) {
                //       console.log("err", err);
                //     }
                // });

                const { mimetype, buffer } = req?.files?.attachment[0];
                const img = mimetype.split('/');
                const extension = img[1].toLowerCase();

                const fileName = (req.files.attachment[0].originalname = uuidv4() + "." + extension);
                const uploadImgRes = await uploadFile(buffer, fileName, "lead-attachments", extension);
                imgPath = fileName;
            }
        } else {
            return response400(res, "Lead data not found");
        }
    })
})

module.exports = { addLeads, getAllLeads, updateLead }