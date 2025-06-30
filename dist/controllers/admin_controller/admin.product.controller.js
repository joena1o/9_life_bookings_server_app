"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchingPendingProducts = exports.approveProduct = exports.delistProduct = void 0;
const product_model_1 = __importDefault(require("../../models/product_model"));
const jwt_service_1 = require("../../utils/jwt_service");
const bookmark_model_1 = __importDefault(require("../../models/bookmark_model"));
const delistProduct = async (req, res) => {
    try {
        const { productId, status } = req.body;
        const delist = await product_model_1.default.findOneAndUpdate({ _id: productId }, {
            delisted: status
        }, { new: true });
        return res.status(200).json({ data: delist, message: "Product has been delisted successfully" });
    }
    catch (e) {
        return res.status(500).json({ error: e });
    }
};
exports.delistProduct = delistProduct;
const approveProduct = async (req, res) => {
    try {
        const { productId, userId, status } = req.body;
        const approve = await product_model_1.default.findOneAndUpdate({ _id: productId }, {
            approved: status,
            approvedBy: userId
        }, { new: true }).populate('user_id');
        return res.status(200).json({ data: approve, message: `Product has been ${status ? "approved" : "disapproved"} successfully` });
    }
    catch (e) {
        return res.status(500).json({ error: e });
    }
};
exports.approveProduct = approveProduct;
const fetchingPendingProducts = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            // Fetch all products
            const products = await product_model_1.default.find().populate("user_id").sort({ createdAt: -1 }).lean();
            // Fetch all bookmarks for the user
            const bookmarks = await bookmark_model_1.default.find({ user_id }).lean();
            const bookmarkedProductIds = bookmarks.map(bookmark => bookmark.product_id);
            // Add `isBookmarked` field to products
            const productsWithBookmarkInfo = products.map(product => ({
                ...product,
                isBookmarked: bookmarkedProductIds.includes(product._id.toString())
            }));
            return res.status(200).json({ data: productsWithBookmarkInfo });
        }
    }
    catch (e) {
        return res.status(500).json({ error: e });
    }
};
exports.fetchingPendingProducts = fetchingPendingProducts;
