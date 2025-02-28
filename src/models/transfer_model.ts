import mongoose, { Schema, Document, Model } from "mongoose";

// Define interfaces for the transfer event structure
interface IRecipientDetails {
  authorization_code?: string | null;
  account_number: string;
  account_name?: string | null;
  bank_code: string;
  bank_name: string;
}

interface IRecipient {
  active: boolean;
  currency: string;
  description?: string | null;
  domain: string;
  email?: string | null;
  id: number;
  integration: number;
  metadata?: any;
  name: string;
  recipient_code: string;
  type: string;
  is_deleted: boolean;
  details: IRecipientDetails;
  created_at: Date;
  updated_at: Date;
}

interface IIntegration {
  id: number;
  is_live: boolean;
  business_name: string;
}

interface ISession {
  provider?: string | null;
  id?: string | null;
}

interface ITransferData {
  user_id: string,  
  disbursedBy: string,
  amount: number;
  currency: string;
  domain: string;
  failures?: any;
  id: number;
  integration: IIntegration;
  reason: string;
  reference: string;
  source: string;
  source_details?: any;
  status: "success" | "failed" | "reversed";
  titan_code?: string | null;
  transfer_code: string;
  transferred_at?: Date | null;
  recipient: IRecipient;
  session: ISession;
  created_at: Date;
  updated_at: Date;
}

interface ITransferEvent extends Document {
  event: "transfer.success" | "transfer.failed" | "transfer.reversed";
  data: ITransferData;
}

// Define the schema without renaming fields
const TransferEventSchema = new Schema<ITransferEvent>(
  {
    event: { type: String, required: true, enum: ["transfer.success", "transfer.failed", "transfer.reversed"] },
    data: {
      user_id: {type: String, required: true},  
      disbursedBy: {type: String, required: true},
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
      domain: { type: String, required: true },
      failures: { type: Schema.Types.Mixed, default: null },
      id: { type: Number, required: true },
      integration: {
        id: { type: Number, required: true },
        is_live: { type: Boolean, required: true },
        business_name: { type: String, required: true },
      },
      reason: { type: String, required: true },
      reference: { type: String, required: true },
      source: { type: String, required: true },
      source_details: { type: Schema.Types.Mixed, default: null },
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
        metadata: { type: Schema.Types.Mixed, default: null },
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
  },
  { timestamps: true }
);

// Define and export the model
const TransferEventModel: Model<ITransferEvent> = mongoose.model<ITransferEvent>("TransferEvent", TransferEventSchema);

export default TransferEventModel;
