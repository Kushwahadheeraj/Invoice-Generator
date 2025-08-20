// client/src/components/EmptyState.tsx
import React from 'react';
import emptyIcon from '../assets/illustration-empty.svg';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-36">
      <img src={emptyIcon} alt="No invoices" className="w-60 h-auto" />
      <h2 className="text-2xl font-bold text-dark-1 mt-16">There is nothing here</h2>
      <p className="text-light-2 mt-6 max-w-xs">
        Create a new invoice by clicking the <br /> <strong>New Invoice</strong> button and get started
      </p>
    </div>
  );
};

export default EmptyState;