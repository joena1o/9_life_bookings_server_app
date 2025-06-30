"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.editProduct = exports.getUsersProducts = exports.searchAndFilterProducts = exports.getProduct = exports.getProducts = exports.addProduct = void 0;
const product_model_1 = __importDefault(require("../models/product_model"));
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_service_1 = require("../utils/jwt_service");
const bookmark_model_1 = __importDefault(require("../models/bookmark_model"));
const notification_model_1 = __importDefault(require("../models/notification_model"));
const addProduct = async (req, res) => {
    try {
        let product = await product_model_1.default.create(req.body);
        if (product) {
            await notification_model_1.default.create({
                user_id: product.user_id,
                product_id: product._id,
                noticeType: 'admin',
                message: `Hi Admin, A new property has been upload. click here to review or go to properties tab to inspect`,
                title: "A new property has been Upload",
            });
            return res
                .status(201)
                .json({ added: true, message: "Product Uploaded Successfully" });
        }
        else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.addProduct = addProduct;
const getProducts = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            // Fetch all products
            const products = await product_model_1.default.find({ approved: true, delisted: false }).populate("user_id").sort({ createdAt: -1 }).lean();
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
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const { id } = req.params;
            // Fetch all products
            const product = await product_model_1.default.findById(id).populate("user_id").sort({ createdAt: -1 }).lean();
            // Fetch all bookmarks for the user
            const bookmarks = await bookmark_model_1.default.find({ user_id }).lean();
            const bookmarkedProductIds = bookmarks.map(bookmark => bookmark.product_id);
            // Add `isBookmarked` field to products
            const productsWithBookmarkInfo = {
                ...product,
                isBookmarked: bookmarkedProductIds.includes(product._id.toString())
            };
            return res.status(200).json({ data: productsWithBookmarkInfo });
        }
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
exports.getProduct = getProduct;
const searchAndFilterProducts = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload;
            const user_id = payload.userId;
            // Extract query parameters for search and filtering
            const { search, category, type, minPrice, maxPrice, sortBy, address } = req.query;
            // Build the query object dynamically
            const query = {
                approved: true,
                delisted: false
            };
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: "i" } }, // Case-insensitive match for product name
                    { description: { $regex: search, $options: "i" } } // Case-insensitive match for product description
                ];
            }
            if (category) {
                query.type = category;
            }
            if (address) {
                query.address = address;
            }
            if (type) {
                query.type = type;
            }
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice)
                    query.price.$gte = parseFloat(minPrice);
                if (maxPrice && maxPrice != null)
                    query.price.$lte = parseFloat(maxPrice);
            }
            // Fetch products based on query
            const products = await product_model_1.default.find(query)
                .populate("user_id")
                .sort({ [sortBy || "createdAt"]: -1 })
                .lean();
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
        else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
exports.searchAndFilterProducts = searchAndFilterProducts;
const getUsersProducts = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const { userId } = req.query;
            const user_id = userId == null ? payload.userId : userId;
            const products = await product_model_1.default.find({ user_id }).populate("user_id").sort({ createdAt: -1 }); // Fetch all products
            return res.status(200).json({ data: products });
        }
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
exports.getUsersProducts = getUsersProducts;
const editProduct = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        const updatedData = req.body;
        let product = await product_model_1.default.findOneAndUpdate({ _id: product_id, user_id }, {
            $set: updatedData
        });
        if (product) {
            return res
                .status(201)
                .json({ data: product, message: "Product Uploaded Successfully" });
        }
        else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.editProduct = editProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID." });
        }
        const deleteBookmarks = await bookmark_model_1.default.deleteMany({ product_id: id });
        if (deleteBookmarks) {
            const deletedProduct = await product_model_1.default.findByIdAndDelete(id);
            if (!deletedProduct) {
                return res.status(401).json({ error: "Product not found." });
            }
            return res.status(200).json({ message: "Product deleted successfully." });
        }
        return res.status(401).json({ error: "An error occured while processing your request." });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.deleteProduct = deleteProduct;
