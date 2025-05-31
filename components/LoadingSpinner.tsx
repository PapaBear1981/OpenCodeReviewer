
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-primary-400' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-transparent ${sizeClasses[size]} ${color}`} style={{ borderTopColor: 'currentColor', borderBottomColor: 'currentColor' }}></div>
  );
};
    