const mongoose = require("mongoose");

const technologySchema = mongoose.Schema({
    technologyName: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    is_Deleted: {
        type: Boolean,
        default: false,
    },
    added_by: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

module.exports = mongoose.model("technology", technologySchema)