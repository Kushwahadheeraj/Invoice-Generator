// client/src/components/InvoiceItem.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Invoice } from '../types';
import StatusBadge from './StatusBadge';

interface InvoiceItemProps {
  invoice: Invoice;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ invoice }) => {
  const formattedDate = new Date(invoice.dueDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const formattedAmount = new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP'
  }).format(invoice.amount);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-transparent hover:border-brand cursor-pointer transition-all duration-200 mb-4">
      <p className="font-bold text-dark-1"><span className="text-light-2">#</span>{invoice.invoiceId.substring(1)}</p>
      <p className="text-light-2 md:col-start-2 justify-self-start md:justify-self-auto">Due {formattedDate}</p>
      <p className="text-light-2 col-start-1 md:col-start-3">{invoice.clientName}</p>
      <p className="font-bold text-xl text-dark-1 col-start-2 md:col-start-4 justify-self-end md:justify-self-auto">{formattedAmount}</p>
      <div className="flex items-center justify-end gap-5 col-start-2 md:col-start-5">
        <StatusBadge status={invoice.status} />
        <ChevronRight className="text-brand hidden md:block" />
      </div>
    </div>
  );
};

export default InvoiceItem;