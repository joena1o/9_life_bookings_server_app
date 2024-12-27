import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret: any = process.env.JWT_SECRET;

function verifyToken(token: string) {
  return Jwt.verify(token, secret);
}

function decodeToken(token: string) {
  return Jwt.decode(token, { complete: true });
}

export { verifyToken, decodeToken };
