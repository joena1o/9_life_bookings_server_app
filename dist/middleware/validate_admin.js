"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkIfAdmin;
const jwt_service_1 = require("../utils/jwt_service");
const user_model_1 = __importDefault(require("../models/user_model"));
async function checkIfAdmin(req, res, next) {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const checkUser = await user_model_1.default.findOne({ _id: user_id });
            if (checkUser) {
                if (checkUser.privileges === "admin") {
                    return next();
                }
                return res.status(401).json({ error: "User does not have admin priviledges" });
            }
            return res.status(401).json({ error: "User does not exist" });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
