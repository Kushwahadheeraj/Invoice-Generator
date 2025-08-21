import api, { endpoints } from './api';
import { Invoice } from '../types';

export interface CreateInvoiceData {
  clientName: string;
  clientEmail: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
  }>;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  id: string;
}

export const invoiceService = {
  async getInvoices(filters?: string[]): Promise<Invoice[]> {
    try {
      const params = new URLSearchParams();
      if (filters && filters.length > 0) {
        params.append('status', filters.join(','));
      }
      
      const response = await api.get(`${endpoints.invoices.list}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch invoices');
    }
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    try {
      const response = await api.get(endpoints.invoices.getById(id));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch invoice');
    }
  },

  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    try {
      const response = await api.post(endpoints.invoices.create, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create invoice');
    }
  },

  async updateInvoice(data: UpdateInvoiceData): Promise<Invoice> {
    try {
      const response = await api.put(endpoints.invoices.update(data.id), data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update invoice');
    }
  },

  async deleteInvoice(id: string): Promise<void> {
    try {
      await api.delete(endpoints.invoices.delete(id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete invoice');
    }
  },
};
