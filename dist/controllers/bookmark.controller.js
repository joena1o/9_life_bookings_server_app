"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersBookmarks = exports.bookmarkItem = void 0;
const jwt_service_1 = require("../utils/jwt_service");
const bookmark_model_1 = __importDefault(require("../models/bookmark_model"));
const bookmarkItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        if (!user_id || !product_id) {
            return res.status(400).json({ error: "User ID and Item ID are required" });
        }
        // Check if the item already exists in the bookmarks
        const existingBookmark = await bookmark_model_1.default.findOne({ user_id, product_id });
        if (existingBookmark) {
            // If it exists, remove it
            await bookmark_model_1.default.deleteOne({ _id: existingBookmark._id });
            return res.status(200).json({ message: "Item removed from bookmark", added: false });
        }
        else {
            // If it doesn’t exist, add it
            await bookmark_model_1.default.create({ user_id, product_id });
            return res.status(201).json({
                message: "Item has been added to your bookmark", added: true
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            error: err,
        });
    }
};
exports.bookmarkItem = bookmarkItem;
const getUsersBookmarks = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const products = await bookmark_model_1.default.find({ user_id }).populate({ path: 'product_id',
                populate: {
                    path: 'user_id', // Nested field inside product_id
                } }).sort({ createdAt: 1 }); // Fetch all products
            return res.status(200).json({ data: products });
        }
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};
exports.getUsersBookmarks = getUsersBookmarks;
