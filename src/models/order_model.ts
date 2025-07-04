import mongoose, { Document, Schema, Model } from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.ENCRYPTION_KEY;

if (!SECRET_KEY) {
  throw new Error("ENCRYPTION_SECRET is not defined in the environment variables.");
}

if (SECRET_KEY.length !== 64) {
  throw new Error("ENCRYPTION_SECRET must be a 64-character hex string (32 bytes).");
}

// Encryption function
const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

// Decryption function
const decrypt = (encryptedText: string): string => {
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted text format.");
    }
    const iv = Buffer.from(parts[0], "hex");
    const encryptedData = parts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "hex"), iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt the text.");
  }
};

// Order interface extending Mongoose Document
interface IOrder extends Document {
  merchantId: string;
  userId: string;
  purchaseType: "purchase" | "booking";
  productId: string;
  startBookingDate?: Date | null;
  endBookingDate?: Date | null;
  quantity: number;
  note?: string | null;
  amount: number;
  disbursed: string;
  transactionReference: string;
  getDecryptedDisbursed: () => string;
}

// Order schema definition
const orderSchema = new Schema<IOrder>(
  {
    merchantId: { type: String, required: true, ref: "user" },
    userId: { type: String, required: true, ref: "user" },
    purchaseType: { type: String, required: true, enum: ["purchase", "booking"] },
    productId: { type: String, required: true, ref: "product" },
    startBookingDate: { type: Date, default: null },
    endBookingDate: { type: Date, default: null },
    quantity: { type: Number, required: true },
    note: { type: String, default: null },
    amount: { type: Number, required: true },
    disbursed: { type: String, default: 'No' },
    transactionReference: { type: String, sparse: true }, // Add this - sparse allows nulls
  },
  { timestamps: true }
);

// Middleware to encrypt before saving
orderSchema.pre<IOrder>("save", function (next) {
  if (!this.disbursed) {
    this.disbursed = encrypt("No"); // Encrypt default before saving
  } else if (this.isModified("disbursed")) {
    this.disbursed = encrypt(this.disbursed);
  }
  next();
});


// Instance method to decrypt disbursed field
orderSchema.methods.getDecryptedDisbursed = function (): string {
  return decrypt(this.disbursed);
};

// Model definition
const OrderModel: Model<IOrder> = mongoose.model<IOrder>("order", orderSchema);

export default OrderModel;
