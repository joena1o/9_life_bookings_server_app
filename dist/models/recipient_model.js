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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema
const RecipientSchema = new mongoose_1.Schema({
    user_id: { type: String, required: true },
    business_name: { type: String, required: true },
    active: { type: Boolean, required: true },
    createdAt: { type: Date, required: true },
    currency: { type: String, required: true },
    domain: { type: String, required: true },
    id: { type: Number, required: true, unique: true }, // Paystack's recipient ID
    integration: { type: Number, required: true },
    name: { type: String, required: true },
    recipient_code: { type: String, required: true, unique: true }, // Store recipient_code
    type: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    is_deleted: { type: Boolean, required: true, default: false },
    details: {
        authorization_code: { type: String, default: null },
        account_number: { type: String, required: true },
        account_name: { type: String, default: null },
        bank_code: { type: String, required: true },
        bank_name: { type: String, required: true },
    },
}, { timestamps: true });
// Define and export the model
const RecipientModel = mongoose_1.default.model("Recipient", RecipientSchema);
exports.default = RecipientModel;
