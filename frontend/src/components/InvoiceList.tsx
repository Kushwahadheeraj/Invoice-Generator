// client/src/components/InvoiceList.tsx
import React from 'react';
import { Invoice } from '../types';
import InvoiceItem from './InvoiceItem';

interface InvoiceListProps {
  invoices: Invoice[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  return (
    <div className="mt-16">
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice._id} invoice={invoice} />
      ))}
    </div>
  );
};

export default InvoiceList;