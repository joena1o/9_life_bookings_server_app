import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface for the recipient document
interface IRecipient extends Document {
  user_id: string,  
  business_name: string;
  orderId: string;
  active: boolean;
  createdAt: Date;
  currency: string;
  domain: string;
  id: number;
  integration: number;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: Date;
  is_deleted: boolean;
  details: {
    authorization_code?: string | null;
    account_number: string;
    account_name?: string | null;
    bank_code: string;
    bank_name: string;
  };
}

// Define the schema
const RecipientSchema = new Schema<IRecipient>(
  {
    user_id: {type: String, required: true},
    business_name: { type: String, required: true },
    orderId: {type: String, required: true},
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
  },
  { timestamps: true }
);

// Define and export the model
const RecipientModel: Model<IRecipient> = mongoose.model<IRecipient>("Recipient", RecipientSchema);
export default RecipientModel;
