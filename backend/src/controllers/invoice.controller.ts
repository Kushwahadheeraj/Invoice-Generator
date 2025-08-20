// server/src/controllers/invoice.controller.ts
import { Request, Response } from 'express';
import { Invoice } from '../models/invoice.model';

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status && typeof status === 'string' && status.length > 0) {
      const statuses = status.split(','); // e.g., "paid,pending"
      filter = { status: { $in: statuses } };
    }
    
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const subtotal = data.items.reduce((acc: number, item: any) => acc + item.quantity * item.rate, 0);
    const gst = Math.round((subtotal * 0.18 + Number.EPSILON) * 100) / 100;
    const amount = Math.round((subtotal + gst + Number.EPSILON) * 100) / 100;

    const invoice = await Invoice.create({
      ...data,
      subtotal,
      gst,
      amount,
      status: data.status || 'pending'
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice', error });
  }
};