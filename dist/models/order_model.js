"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.ENCRYPTION_KEY;
if (!SECRET_KEY) {
    throw new Error("ENCRYPTION_SECRET is not defined in the environment variables.");
}
if (SECRET_KEY.length !== 64) {
    throw new Error("ENCRYPTION_SECRET must be a 64-character hex string (32 bytes).");
}
// Encryption function
const encrypt = (text) => {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "hex"), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
};
// Decryption function
const decrypt = (encryptedText) => {
    try {
        const parts = encryptedText.split(":");
        if (parts.length !== 2) {
            throw new Error("Invalid encrypted text format.");
        }
        const iv = Buffer.from(parts[0], "hex");
        const encryptedData = parts[1];
        const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY, "hex"), iv);
        let decrypted = decipher.update(encryptedData, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
    catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Failed to decrypt the text.");
    }
};
// Order schema definition
const orderSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// Middleware to encrypt before saving
orderSchema.pre("save", function (next) {
    if (!this.disbursed) {
        this.disbursed = encrypt("No"); // Encrypt default before saving
    }
    else if (this.isModified("disbursed")) {
        this.disbursed = encrypt(this.disbursed);
    }
    next();
});
// Instance method to decrypt disbursed field
orderSchema.methods.getDecryptedDisbursed = function () {
    return decrypt(this.disbursed);
};
// Model definition
const OrderModel = mongoose_1.default.model("order", orderSchema);
exports.default = OrderModel;
