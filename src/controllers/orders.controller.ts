import OrderModel from "../models/order_model";
import {Response, Request} from 'express';
import { decodeToken } from "../utils/jwt_service";
import { JwtPayload } from "jsonwebtoken";


export const fetchCustomerOrders = async (req: Request, res: Response): Promise<any> =>{
    try{
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
            const user_id = payload.userId;
        const letOrders = await OrderModel.find({userId: user_id}).populate("productId").populate("userId").sort({ createdAt: -1 });
        console.log(letOrders);
        return res.status(200).json({data: letOrders});
    } 
    }catch(err){
        return res.status(500).json({error: err});
    }
}

export const getBookingAvailability = async (req: Request, res: Response): Promise<any> => {
    try {
      const {productId} = req.params;
      const bookings = await OrderModel.find({
        productId,
        purchaseType: "booking",
      });
      return res.status(200).json({data: bookings});
    } catch (error) {
     return res.status(500).json({error: error});
    }
  };