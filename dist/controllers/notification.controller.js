"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("../models/notification_model"));
const jwt_service_1 = require("../utils/jwt_service");
const getNotifications = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const getNotifications = await notification_model_1.default.find({ user_id: user_id }).sort({ createdAt: -1 });
            return res.status(200).json({ data: getNotifications });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
};
exports.getNotifications = getNotifications;
