const mongoose = require("mongoose");

const studyPlanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        task: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const StudyPlan = mongoose.model(
    "StudyPlan",
    studyPlanSchema
);

module.exports = StudyPlan;