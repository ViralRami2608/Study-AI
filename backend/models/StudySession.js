const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
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

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const StudySession = mongoose.model(
    "StudySession",
    studySessionSchema
);

module.exports = StudySession;