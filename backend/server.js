const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const connectDB = require("./config/db");
const Note = require("./models/Note");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================
   PDF UPLOAD CONFIGURATION
========================================= */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."));
        }
    }
});

/* =========================================
   SERVE UPLOADED FILES
========================================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================================
   HOME ROUTE
========================================= */

app.get("/", (req, res) => {
    res.send("StudyAI Backend is Running!");
});

/* =========================================
   GET ALL NOTES
========================================= */

app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notes",
            error: error.message
        });
    }
});

/* =========================================
   CREATE NOTE + OPTIONAL PDF
========================================= */

app.post("/api/notes", upload.single("attachment"), async (req, res) => {
    try {
        const { title, subject, content } = req.body;

        const noteData = {
            title,
            subject,
            content
        };

        if (req.file) {
            noteData.attachment = {
                fileName: req.file.originalname,
                fileUrl: `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`,
                fileType: req.file.mimetype,
                fileSize: req.file.size
            };
        }

        const note = await Note.create(noteData);

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create note",
            error: error.message
        });
    }
});

/* =========================================
   UPDATE NOTE + OPTIONAL NEW PDF
========================================= */

app.put("/api/notes/:id", upload.single("attachment"), async (req, res) => {
    try {
        const { title, subject, content } = req.body;

        const updateData = {
            title,
            subject,
            content
        };

        if (req.file) {
            updateData.attachment = {
                fileName: req.file.originalname,
                fileUrl: `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`,
                fileType: req.file.mimetype,
                fileSize: req.file.size
            };
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update note",
            error: error.message
        });
    }
});

/* =========================================
   DELETE NOTE
========================================= */

app.delete("/api/notes/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete note",
            error: error.message
        });
    }
});

/* =========================================
   ERROR HANDLER
========================================= */

app.use((error, req, res, next) => {
    if (error.message === "Only PDF files are allowed.") {
        return res.status(400).json({
            message: error.message
        });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "PDF file size cannot exceed 10 MB."
        });
    }

    res.status(500).json({
        message: "Server error",
        error: error.message
    });
});

/* =========================================
   START SERVER
========================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});