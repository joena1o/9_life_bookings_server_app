import mongoose, { Schema, Document } from "mongoose";

interface TransferData {
  domain: string;
  amount: number;
  currency: string;
  reference: string;
  source: string;
  source_details?: any;
  reason: string;
  status: string;
  failures?: any;
  transfer_code: string;
  titan_code?: any;
  transferred_at?: Date;
  id: number;
  integration: number;
  recipient: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ITransfer extends Document {
  status: boolean;
  message: string;
  data: TransferData;
  user_id: string,  
  disbursedBy: string;
  orderId: string;
}

const TransferSchema: Schema = new Schema(
  {
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
      source_details: { type: Schema.Types.Mixed, default: null },
      reason: { type: String, required: true },
      status: { type: String, required: true },
      failures: { type: Schema.Types.Mixed, default: null },
      transfer_code: { type: String, required: true, unique: true },
      titan_code: { type: Schema.Types.Mixed, default: null },
      transferred_at: { type: Date, default: null },
      id: { type: Number, required: true, unique: true },
      integration: { type: Number, required: true },
      recipient: { type: Number, required: true },
      createdAt: { type: Date, required: true },
      updatedAt: { type: Date, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransfer>("Transfer", TransferSchema);
