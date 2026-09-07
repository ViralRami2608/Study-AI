const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const Note = require("./models/Note");
const User = require("./models/User");
const StudyPlan = require("./models/StudyPlan");
const authenticateToken = require("./middleware/auth");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());
app.use(express.json());

// =========================================
// FILE UPLOAD SETUP
// =========================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
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

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// =========================================
// HOME ROUTE
// =========================================

app.get("/", (req, res) => {
    res.json({
        message: "StudyAI Backend is running successfully!"
    });
});

// =========================================
// USER REGISTER
// =========================================

app.post("/api/users/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Registration Error:", error.message);

        res.status(500).json({
            message: "Server error during registration."
        });
    }
});

// =========================================
// USER LOGIN
// =========================================

app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful.",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.log("Login Error:", error.message);

        res.status(500).json({
            message: "Server error during login."
        });
    }
});

// =========================================
// USER PROFILE
// =========================================

app.get(
    "/api/users/profile",
    authenticateToken,
    async (req, res) => {
        try {
            const user = await User.findById(
                req.user.userId
            ).select("-password");

            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                });
            }

            res.status(200).json(user);

        } catch (error) {
            console.log("Profile Error:", error.message);

            res.status(500).json({
                message: "Server error."
            });
        }
    }
);

// =========================================
// NOTES - GET ALL
// =========================================

app.get(
    "/api/notes",
    authenticateToken,
    async (req, res) => {
        try {
            const notes = await Note.find({
                userId: req.user.userId
            }).sort({
                createdAt: -1
            });

            res.status(200).json(notes);

        } catch (error) {
            console.log("Get Notes Error:", error.message);

            res.status(500).json({
                message: "Failed to fetch notes."
            });
        }
    }
);

// =========================================
// NOTES - CREATE
// =========================================

app.post(
    "/api/notes",
    authenticateToken,
    upload.single("attachment"),
    async (req, res) => {
        try {
            const {
                title,
                subject,
                content
            } = req.body;

            if (!title || !subject || !content) {
                return res.status(400).json({
                    message:
                        "Title, subject and content are required."
                });
            }

            const noteData = {
                userId: req.user.userId,
                title,
                subject,
                content
            };

            if (req.file) {
                noteData.attachment = {
                    fileName: req.file.originalname,
                    fileUrl:
                        `/uploads/${req.file.filename}`,
                    fileType: req.file.mimetype,
                    fileSize: req.file.size
                };
            }

            const note = await Note.create(noteData);

            res.status(201).json({
                message: "Note created successfully.",
                note
            });

        } catch (error) {
            console.log("Create Note Error:", error.message);

            res.status(500).json({
                message: "Failed to create note."
            });
        }
    }
);

// =========================================
// NOTES - UPDATE
// =========================================

app.put(
    "/api/notes/:id",
    authenticateToken,
    upload.single("attachment"),
    async (req, res) => {
        try {
            const {
                title,
                subject,
                content
            } = req.body;

            const updateData = {
                title,
                subject,
                content
            };

            if (req.file) {
                updateData.attachment = {
                    fileName: req.file.originalname,
                    fileUrl:
                        `/uploads/${req.file.filename}`,
                    fileType: req.file.mimetype,
                    fileSize: req.file.size
                };
            }

            const note =
                await Note.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        userId: req.user.userId
                    },
                    updateData,
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!note) {
                return res.status(404).json({
                    message: "Note not found."
                });
            }

            res.status(200).json({
                message: "Note updated successfully.",
                note
            });

        } catch (error) {
            console.log("Update Note Error:", error.message);

            res.status(500).json({
                message: "Failed to update note."
            });
        }
    }
);

// =========================================
// NOTES - DELETE
// =========================================

app.delete(
    "/api/notes/:id",
    authenticateToken,
    async (req, res) => {
        try {
            const note =
                await Note.findOneAndDelete({
                    _id: req.params.id,
                    userId: req.user.userId
                });

            if (!note) {
                return res.status(404).json({
                    message: "Note not found."
                });
            }

            res.status(200).json({
                message: "Note deleted successfully."
            });

        } catch (error) {
            console.log("Delete Note Error:", error.message);

            res.status(500).json({
                message: "Failed to delete note."
            });
        }
    }
);

// =========================================
// STUDY PLANNER - GET ALL
// =========================================

app.get(
    "/api/study-plans",
    authenticateToken,
    async (req, res) => {
        try {
            const plans = await StudyPlan.find({
                userId: req.user.userId
            }).sort({
                date: 1,
                startTime: 1
            });

            res.status(200).json(plans);

        } catch (error) {
            console.log(
                "Get Study Plans Error:",
                error.message
            );

            res.status(500).json({
                message: "Failed to fetch study plans."
            });
        }
    }
);

// =========================================
// STUDY PLANNER - CREATE
// =========================================

app.post(
    "/api/study-plans",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                subject,
                task,
                date,
                startTime,
                endTime,
                status
            } = req.body;

            if (
                !subject ||
                !task ||
                !date ||
                !startTime ||
                !endTime
            ) {
                return res.status(400).json({
                    message:
                        "Subject, task, date, start time and end time are required."
                });
            }

            const studyPlan = await StudyPlan.create({
                userId: req.user.userId,
                subject,
                task,
                date,
                startTime,
                endTime,
                status: status || "Pending"
            });

            res.status(201).json({
                message:
                    "Study plan created successfully.",
                studyPlan
            });

        } catch (error) {
            console.log(
                "Create Study Plan Error:",
                error.message
            );

            res.status(500).json({
                message: "Failed to create study plan."
            });
        }
    }
);

// =========================================
// STUDY PLANNER - UPDATE
// =========================================

app.put(
    "/api/study-plans/:id",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                subject,
                task,
                date,
                startTime,
                endTime,
                status
            } = req.body;

            const studyPlan =
                await StudyPlan.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        userId: req.user.userId
                    },
                    {
                        subject,
                        task,
                        date,
                        startTime,
                        endTime,
                        status
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!studyPlan) {
                return res.status(404).json({
                    message: "Study plan not found."
                });
            }

            res.status(200).json({
                message:
                    "Study plan updated successfully.",
                studyPlan
            });

        } catch (error) {
            console.log(
                "Update Study Plan Error:",
                error.message
            );

            res.status(500).json({
                message: "Failed to update study plan."
            });
        }
    }
);

// =========================================
// STUDY PLANNER - DELETE
// =========================================

app.delete(
    "/api/study-plans/:id",
    authenticateToken,
    async (req, res) => {
        try {
            const studyPlan =
                await StudyPlan.findOneAndDelete({
                    _id: req.params.id,
                    userId: req.user.userId
                });

            if (!studyPlan) {
                return res.status(404).json({
                    message: "Study plan not found."
                });
            }

            res.status(200).json({
                message:
                    "Study plan deleted successfully."
            });

        } catch (error) {
            console.log(
                "Delete Study Plan Error:",
                error.message
            );

            res.status(500).json({
                message: "Failed to delete study plan."
            });
        }
    }
);

// =========================================
// ERROR HANDLER
// =========================================

app.use((error, req, res, next) => {
    if (
        error.message ===
        "Only PDF files are allowed."
    ) {
        return res.status(400).json({
            message: error.message
        });
    }

    if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_SIZE"
    ) {
        return res.status(400).json({
            message: "PDF file must be 10MB or smaller."
        });
    }

    console.log("Server Error:", error.message);

    res.status(500).json({
        message: "Something went wrong."
    });
});

// =========================================
// START SERVER
// =========================================

app.listen(PORT, () => {
    console.log(
        `StudyAI Backend running on http://localhost:${PORT}`
    );
});