
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className = "" }) => {
  const validPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div 
      className={`w-full bg-slate-600 rounded-full h-3 dark:bg-slate-700 overflow-hidden shadow-inner ${className}`}
      role="progressbar"
      aria-valuenow={validPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Analysis progress"
    >
      <div
        className="bg-primary-500 h-3 rounded-full transition-all duration-300 ease-out flex items-center justify-center"
        style={{ width: `${validPercentage}%` }}
      >
        {/* Optional: text inside bar if needed, for now keep it clean */}
        {/* {validPercentage > 10 && <span className="text-xs font-medium text-white">{`${Math.round(validPercentage)}%`}</span>} */}
      </div>
    </div>
  );
};
