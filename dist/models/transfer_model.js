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
// Define the schema without renaming fields
const TransferEventSchema = new mongoose_1.Schema({
    event: { type: String, required: true, enum: ["transfer.success", "transfer.failed", "transfer.reversed"] },
    data: {
        user_id: { type: String, required: true },
        disbursedBy: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        domain: { type: String, required: true },
        failures: { type: mongoose_1.Schema.Types.Mixed, default: null },
        id: { type: Number, required: true },
        integration: {
            id: { type: Number, required: true },
            is_live: { type: Boolean, required: true },
            business_name: { type: String, required: true },
        },
        reason: { type: String, required: true },
        reference: { type: String, required: true },
        source: { type: String, required: true },
        source_details: { type: mongoose_1.Schema.Types.Mixed, default: null },
        status: { type: String, required: true, enum: ["success", "failed", "reversed"] },
        titan_code: { type: String, default: null },
        transfer_code: { type: String, required: true },
        transferred_at: { type: Date, default: null },
        recipient: {
            active: { type: Boolean, required: true },
            currency: { type: String, required: true },
            description: { type: String, default: null },
            domain: { type: String, required: true },
            email: { type: String, default: null },
            id: { type: Number, required: true },
            integration: { type: Number, required: true },
            metadata: { type: mongoose_1.Schema.Types.Mixed, default: null },
            name: { type: String, required: true },
            recipient_code: { type: String, required: true },
            type: { type: String, required: true },
            is_deleted: { type: Boolean, required: true },
            details: {
                authorization_code: { type: String, default: null },
                account_number: { type: String, required: true },
                account_name: { type: String, default: null },
                bank_code: { type: String, required: true },
                bank_name: { type: String, required: true },
            },
            created_at: { type: Date, required: true },
            updated_at: { type: Date, required: true },
        },
        session: {
            provider: { type: String, default: null },
            id: { type: String, default: null },
        },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
}, { timestamps: true });
// Define and export the model
const TransferEventModel = mongoose_1.default.model("TransferEvent", TransferEventSchema);
exports.default = TransferEventModel;
