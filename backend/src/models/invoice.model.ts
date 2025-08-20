// server/src/models/invoice.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceId: string;
  clientName: string;
  clientEmail?: string;
  dueDate: Date;
  items: Array<{
    name: string;
    quantity: number;
    rate: number;
    total: number;
  }>;
  subtotal: number;
  gst: number;
  amount: number;
  status: 'paid' | 'pending' | 'draft';
}

const InvoiceSchema = new Schema<IInvoice>({
  invoiceId: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String },
  dueDate: { type: Date, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      rate: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  subtotal: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending', 'draft'], required: true },
}, { timestamps: true });

export const Invoice = model<IInvoice>('Invoice', InvoiceSchema);