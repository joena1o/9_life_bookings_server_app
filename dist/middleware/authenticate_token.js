"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticateToken;
const jwt_service_1 = require("../utils/jwt_service");
function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }
    try {
        (0, jwt_service_1.verifyToken)(token);
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
