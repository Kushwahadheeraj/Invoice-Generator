// client/src/types.ts
export interface Invoice {
    _id: string;
    invoiceId: string;
    clientName: string;
    dueDate: string; // Will be a string from JSON
    amount: number;
    status: 'paid' | 'pending' | 'draft';
  }