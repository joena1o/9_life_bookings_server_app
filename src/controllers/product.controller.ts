import { Response, Request } from "express";
import ProductModel from "../models/product_model";
import mongoose from "mongoose";


export const addProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        let product = await ProductModel.create(req.body);
        if (product) {
            return res
                .status(201)
                .json({ data: product, message: "Product Uploaded Successfully" });
        } else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const editProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        let product = await ProductModel.findOneAndUpdate({ _id: id }, {
            $set: updatedData
        });
        if (product) {
            return res
                .status(201)
                .json({ data: product, message: "Product Uploaded Successfully" });
        } else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID." });
        }
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found." });
        }
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}