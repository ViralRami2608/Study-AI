const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        console.log("Authorization Header:", authHeader);

        if (!authHeader) {
            console.log("No Authorization header");
            return res.status(401).json({
                message: "Access denied. Please login."
            });
        }

        const parts = authHeader.split(" ");

        console.log("Authorization Parts:", parts);

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            console.log("Invalid Authorization format");
            return res.status(401).json({
                message: "Invalid authorization format."
            });
        }

        const token = parts[1];

        console.log("Token received:", token);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("JWT verified:", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.log("JWT ERROR:", error.name);
        console.log("JWT MESSAGE:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token.",
            error: error.message
        });
    }
}

module.exports = authenticateToken;