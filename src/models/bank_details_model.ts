import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the document
export interface ISubAccount extends Document {
  user_id: string,  
  business_name: string;
  account_number: string;
  percentage_charge: number;
  settlement_bank: string;
  currency: string;
  bank: number;
  integration: number;
  domain: string;
  account_name: string;
  product: string;
  managed_by_integration: number;
  subaccount_code: string;
  is_verified: boolean;
  settlement_schedule: string;
  active: boolean;
  migrate: boolean;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const SubAccountSchema: Schema = new Schema<ISubAccount>(
  {
    user_id: {type: String, required: true},
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
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Export the model
export default mongoose.model<ISubAccount>('SubAccount', SubAccountSchema);
