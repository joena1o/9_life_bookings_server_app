"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingAvailability = exports.fetchCustomerOrders = void 0;
const order_model_1 = __importDefault(require("../models/order_model"));
const jwt_service_1 = require("../utils/jwt_service");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fetchCustomerOrders = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const letOrders = await order_model_1.default.find({ userId: user_id }).populate("productId").populate("userId").sort({ createdAt: -1 });
            console.log(letOrders);
            return res.status(200).json({ data: letOrders });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.fetchCustomerOrders = fetchCustomerOrders;
const getBookingAvailability = async (req, res) => {
    try {
        const { productId } = req.params;
        const bookings = await order_model_1.default.find({
            productId,
            purchaseType: "booking",
        });
        const formattedBookings = bookings.map((booking) => ({
            ...booking.toObject(),
            startBookingDate: booking.startBookingDate
                ? (0, moment_timezone_1.default)(booking.startBookingDate).tz("Africa/Lagos").format()
                : null,
            endBookingDate: booking.endBookingDate
                ? (0, moment_timezone_1.default)(booking.endBookingDate).tz("Africa/Lagos").format()
                : null,
        }));
        return res.status(200).json({ data: formattedBookings });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
};
exports.getBookingAvailability = getBookingAvailability;
