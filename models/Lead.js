const mongoose = require("mongoose");

const leadSchema = mongoose.Schema({
    sales_person_id: {
        type: mongoose.Schema.ObjectId,
        ref: "sales-person",
        required: true,
    },
    technologies: [{
        type: mongoose.Schema.ObjectId,
        ref: "technology",
        required: true,
    }],
    source: {
        type: String,
        required: true
    },
    client_name: {
        type: String,
        required: true
    },
    priority: {
        enum: ['high', 'medium', 'low'],
        type: String,
        required: true
    },
    attachment: {
        type: String,
    },
    status: {
        // enum: ['newlead', 'ongoing', 'salesdone'],
        type: String,
        required: true,
    },
    tech_head_id: {
        type: mongoose.Schema.ObjectId,
        ref: "tech-head",
        required: true,
    },
    notes: {
        type: String,
    },
    comments: {
        type: String,
    },
    is_Deleted: {
        type: Boolean,
        default: false,
    },
    added_by: {
        type: mongoose.Schema.ObjectId,
        ref: "sales-person",
    },
}, { timestamps: true });

module.exports = mongoose.model("lead", leadSchema);