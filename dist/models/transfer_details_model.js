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
const TransferSchema = new mongoose_1.Schema({
    status: { type: Boolean, required: true },
    message: { type: String, required: true },
    user_id: { type: String, required: true },
    disbursedBy: { type: String, required: true },
    orderId: { type: String, required: true },
    data: {
        domain: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        reference: { type: String, required: true, unique: true },
        source: { type: String, required: true },
        source_details: { type: mongoose_1.Schema.Types.Mixed, default: null },
        reason: { type: String, required: true },
        status: { type: String, required: true },
        failures: { type: mongoose_1.Schema.Types.Mixed, default: null },
        transfer_code: { type: String, required: true, unique: true },
        titan_code: { type: mongoose_1.Schema.Types.Mixed, default: null },
        transferred_at: { type: Date, default: null },
        id: { type: Number, required: true, unique: true },
        integration: { type: Number, required: true },
        recipient: { type: Number, required: true },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Transfer", TransferSchema);
