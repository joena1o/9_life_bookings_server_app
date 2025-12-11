import notificationModel from "../models/notification_model";
import {Response, Request} from 'express';
import { decodeToken } from "../utils/jwt_service";
import { JwtPayload } from "jsonwebtoken";


export const getNotifications = async(req: Request, res: Response): Promise<any> =>{
    try{
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
            const user_id = payload.userId;
        const getNotifications = await notificationModel.find({ user_id: user_id, noticeType: { $ne: 'admin' } }).sort({ createdAt: -1 });
        return res.status(200).json({data: getNotifications});
    }
    }catch(error){
        return res.status(500).json({error: error});
    }
}