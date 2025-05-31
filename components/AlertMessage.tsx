
import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from './Icons'; // Assuming ExclamationTriangleIcon for warning

interface AlertMessageProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onDismiss?: () => void;
  duration?: number; // Auto dismiss duration in ms
}

export const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onDismiss, duration = 5000 }) => {
  useEffect(() => {
    if (onDismiss && duration) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [onDismiss, duration]);

  const baseClasses = "p-4 rounded-md flex items-start shadow-lg";
  let typeClasses = "";
  let IconComponent: React.FC<{className?: string}>;

  switch (type) {
    case 'success':
      typeClasses = "bg-green-700 bg-opacity-80 text-green-100 border border-green-600";
      IconComponent = CheckCircleIcon;
      break;
    case 'error':
      typeClasses = "bg-red-700 bg-opacity-80 text-red-100 border border-red-600";
      IconComponent = XCircleIcon;
      break;
    case 'warning':
      typeClasses = "bg-yellow-700 bg-opacity-80 text-yellow-100 border border-yellow-600";
      IconComponent = ExclamationTriangleIcon;
      break;
    case 'info':
    default:
      typeClasses = "bg-sky-700 bg-opacity-80 text-sky-100 border border-sky-600";
      IconComponent = InformationCircleIcon;
      break;
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <div className="flex-shrink-0">
        <IconComponent className="h-6 w-6" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success' ? 'hover:bg-green-800 focus:ring-green-500 focus:ring-offset-green-700' :
                type === 'error' ? 'hover:bg-red-800 focus:ring-red-500 focus:ring-offset-red-700' :
                type === 'warning' ? 'hover:bg-yellow-800 focus:ring-yellow-500 focus:ring-offset-yellow-700' :
                'hover:bg-sky-800 focus:ring-sky-500 focus:ring-offset-sky-700'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
    