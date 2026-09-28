import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading telemetry & incident records...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-3 text-slate-400">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-light`} />
      <p className="text-xs font-mono tracking-wide">{message}</p>
    </div>
  );
};

export default LoadingState;
