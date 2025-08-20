// client/src/components/StatusBadge.tsx
import React from 'react';

type Status = 'paid' | 'pending' | 'draft';

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, { bg: string; text: string; dot: string }> = {
  paid: {
    bg: 'bg-status-paid/5',
    text: 'text-status-paid',
    dot: 'bg-status-paid',
  },
  pending: {
    bg: 'bg-status-pending/5',
    text: 'text-status-pending',
    dot: 'bg-status-pending',
  },
  draft: {
    bg: 'bg-status-draft/5',
    text: 'text-status-draft',
    dot: 'bg-status-draft',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = statusStyles[status];

  return (
    <div className={`flex items-center justify-center w-28 h-10 rounded-md capitalize font-bold ${styles.bg} ${styles.text}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${styles.dot}`}></span>
      {status}
    </div>
  );
};

export default StatusBadge;