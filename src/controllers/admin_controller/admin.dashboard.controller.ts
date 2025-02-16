import { Response, Request } from 'express';
import ProductModel from '../../models/product_model';
import UserModel from '../../models/user_model';
import OrderModel from '../../models/order_model';

export const numberCounts = async (req: Request, res: Response): Promise<any> => {
    try {
        let productCount = await ProductModel.collection.count();
        let customerCount = await UserModel.collection.count();
        let salesCount = await OrderModel.collection.count();
        let revenueCount = await OrderModel.aggregate([
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
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const fetchCustomersOrders = async (req: Request, res: Response): Promise<any> => {
    try {
        const letOrders = await OrderModel.find().populate("productId").populate("userId").sort({ createdAt: -1 });
        return res.status(200).json({ data: letOrders });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const fetchSalesChartReport = async (req: Request, res: Response): Promise<any> => {
    try {
        // Aggregation to group by the day of the week
        const ordersByDay = await OrderModel.aggregate([
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
    } catch (error) {
        console.error("Error fetching orders by day:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders by day",
        });
    }
}