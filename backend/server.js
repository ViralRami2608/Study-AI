const express = require("express");

const app = express();

const PORT = 5000;


// Middleware
app.use(express.json());


// Home route
app.get("/", (req, res) => {
    res.send("StudyAI Backend is running!");
});


// Start server
app.listen(PORT, () => {
    console.log(`StudyAI Backend running on http://localhost:${PORT}`);
});