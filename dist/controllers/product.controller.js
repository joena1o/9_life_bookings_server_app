"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.editProduct = exports.getProducts = exports.addProduct = void 0;
const product_model_1 = __importDefault(require("../models/product_model"));
const mongoose_1 = __importDefault(require("mongoose"));
const addProduct = async (req, res) => {
    try {
        let product = await product_model_1.default.create(req.body);
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
exports.addProduct = addProduct;
const getProducts = async (req, res) => {
    try {
        const products = await product_model_1.default.find(); // Fetch all products
        return res.status(200).json({ data: products });
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
exports.getProducts = getProducts;
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        let product = await product_model_1.default.findOneAndUpdate({ _id: id }, {
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
        const deletedProduct = await product_model_1.default.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found." });
        }
        res.status(200).json({ message: "Product deleted successfully." });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.deleteProduct = deleteProduct;
