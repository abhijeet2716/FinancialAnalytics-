import mongoose, { Schema, Document } from 'mongoose';

export interface ITransactionDocument extends Document {
  id: number;
  date: Date;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true, index: true },
    category: { type: String, required: true, index: true },
    status: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    user_profile: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Search text index helper
TransactionSchema.index({ category: 1, status: 1, user_id: 1 });

export const Transaction = mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);
