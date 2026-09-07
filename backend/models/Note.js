const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        attachment: {
            fileName: {
                type: String,
                default: ""
            },

            fileUrl: {
                type: String,
                default: ""
            },

            fileType: {
                type: String,
                default: ""
            },

            fileSize: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;