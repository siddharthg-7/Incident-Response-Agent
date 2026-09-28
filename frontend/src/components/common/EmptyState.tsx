import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no active security incidents matching the current criteria.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3">
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-500">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <div className="max-w-sm">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/40 rounded-lg text-xs font-medium transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
