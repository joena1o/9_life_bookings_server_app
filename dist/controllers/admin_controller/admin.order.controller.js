"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesOrder = void 0;
const order_model_1 = __importDefault(require("../../models/order_model"));
const getSalesOrder = async (req, res) => {
    try {
        let salesOrder = await order_model_1.default.find().populate('userId').populate("merchantId").populate("productId").sort({ createdAt: -1 });
        return res.status(200).json({ data: salesOrder });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.getSalesOrder = getSalesOrder;
