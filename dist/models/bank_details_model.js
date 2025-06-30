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
const SubAccountSchema = new mongoose_1.Schema({
    user_id: { type: String, required: true },
    business_name: { type: String, required: true },
    account_number: { type: String, required: true },
    percentage_charge: { type: Number, required: true },
    settlement_bank: { type: String, required: true },
    currency: { type: String, required: true },
    bank: { type: Number, required: true },
    integration: { type: Number, required: true },
    domain: { type: String, required: true },
    account_name: { type: String, required: true },
    product: { type: String, required: true },
    managed_by_integration: { type: Number, required: true },
    subaccount_code: { type: String, required: true },
    is_verified: { type: Boolean, required: true },
    settlement_schedule: { type: String, required: true },
    active: { type: Boolean, required: true },
    migrate: { type: Boolean, required: true },
    id: { type: Number, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});
// Export the model
exports.default = mongoose_1.default.model('SubAccount', SubAccountSchema);
