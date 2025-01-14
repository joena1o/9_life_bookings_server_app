import { NextFunction, Request, Response } from "express";
import { decodeToken, verifyToken } from "../utils/jwt_service";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user_model";

export default async function checkIfAdmin(
    req: Request,
    res: Response,
    next: any
): Promise<any> {
  try {
    const accessToken = decodeToken(req.headers.authorization!);
    if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
        const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
        const user_id = payload.userId;
        const checkUser = await UserModel.findOne({_id: user_id});
        if(checkUser){
            if(checkUser.privileges === "admin") {
                return next();
            }
            return res.status(401).json({error: "User does not have admin priviledges"});
        }
        return res.status(401).json({error: "User does not exist"});
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}