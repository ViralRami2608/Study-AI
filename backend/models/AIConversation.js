const mongoose = require("mongoose");

const aiConversationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        question: {
            type: String,
            required: true,
            trim: true
        },

        response: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const AIConversation = mongoose.model(
    "AIConversation",
    aiConversationSchema
);

module.exports = AIConversation;