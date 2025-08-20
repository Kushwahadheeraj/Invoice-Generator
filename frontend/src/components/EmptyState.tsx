// client/src/components/EmptyState.tsx
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <h2 className="text-xl font-bold text-dark-1 mt-10">There is nothing here</h2>
      <p className="text-light-2 mt-3 max-w-xs text-sm">
        Create a new invoice by clicking the <span className="font-bold">New Invoice</span> button and get started
      </p>
    </div>
  );
};

export default EmptyState;