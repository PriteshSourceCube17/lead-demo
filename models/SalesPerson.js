const mongoose = require("mongoose");

const salesPersonSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    territory: {
        type: String,
        required: true,
    },
    added_by: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    updated_by: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    is_Deleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("sales-person", salesPersonSchema)