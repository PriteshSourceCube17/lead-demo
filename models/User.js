const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        enum: ['admin', 'sales-person', 'tech-head'],
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    is_Deleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)