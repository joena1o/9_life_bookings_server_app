import { verifyToken } from "../utils/jwt_service";
import { Request, Response } from "express";

export default function authenticateToken(
  req: Request,
  res: Response,
  next: any
): any {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
