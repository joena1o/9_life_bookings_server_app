"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSalesChartReport = exports.fetchCustomersOrders = exports.numberCounts = void 0;
const product_model_1 = __importDefault(require("../../models/product_model"));
const user_model_1 = __importDefault(require("../../models/user_model"));
const order_model_1 = __importDefault(require("../../models/order_model"));
const numberCounts = async (req, res) => {
    try {
        let productCount = await product_model_1.default.collection.count();
        let customerCount = await user_model_1.default.collection.count();
        let salesCount = await order_model_1.default.collection.count();
        let revenueCount = await order_model_1.default.aggregate([
            {
                $group: {
                    _id: null, // null groups all orders together
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        let totalRevenue = revenueCount.length > 0 ? revenueCount[0].totalAmount : 0;
        return res.status(200).json({
            products: productCount,
            sales: salesCount, revenue: (totalRevenue * 0.05) / 100,
            customers: customerCount
        });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.numberCounts = numberCounts;
const fetchCustomersOrders = async (req, res) => {
    try {
        const letOrders = await order_model_1.default.find().populate("productId").populate("userId").sort({ createdAt: -1 });
        return res.status(200).json({ data: letOrders });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.fetchCustomersOrders = fetchCustomersOrders;
const fetchSalesChartReport = async (req, res) => {
    try {
        // Aggregation to group by the day of the week
        const ordersByDay = await order_model_1.default.aggregate([
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" }, // Group by the day of the week (1=Sunday, 7=Saturday)
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $sort: { _id: 1 }, // Sort by day of the week
            },
        ]);
        // Map MongoDB days to readable week days
        const daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const formattedData = daysMap.map((day, index) => {
            const dataForDay = ordersByDay.find((data) => data._id === index + 1); // Find data for the current day
            const totalAmount = dataForDay ? dataForDay.totalAmount : 0;
            const totalOrders = dataForDay ? dataForDay.totalOrders : 0;
            const revenue = totalAmount * 0.05; // Calculate revenue (5% of totalAmount)
            return {
                day,
                totalOrders,
                totalAmount,
                revenue,
            };
        });
        res.status(200).json({
            success: true,
            data: formattedData,
        });
    }
    catch (error) {
        console.error("Error fetching orders by day:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders by day",
        });
    }
};
exports.fetchSalesChartReport = fetchSalesChartReport;
