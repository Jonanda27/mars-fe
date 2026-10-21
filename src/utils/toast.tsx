import React from 'react';
import toast, { ToastOptions, Renderable } from 'react-hot-toast';
import { AlertTriangle, Info } from 'lucide-react';

export const WarningIcon: React.FC<{ color?: string; size?: number; className?: string }> = ({
  color = '#f39c12',
  size = 20,
  className = '',
}) => (
  <AlertTriangle
    size={size}
    className={`flex-shrink-0 ${className}`}
    style={{ color }}
    strokeWidth={2}
    aria-hidden="true"
  />
);

export const InfoIcon: React.FC<{ color?: string; size?: number; className?: string }> = ({
  color = '#3c8dbc',
  size = 20,
  className = '',
}) => (
  <Info
    size={size}
    className={`flex-shrink-0 ${className}`}
    style={{ color }}
    strokeWidth={2}
    aria-hidden="true"
  />
);

export const toastWarning = (message: Renderable, options?: ToastOptions) => {
  return toast(message, {
    ...options,
    icon: <WarningIcon />,
    style: {
      borderLeft: '4px solid #f39c12',
      ...options?.style,
    },
  });
};

export const toastInfo = (message: Renderable, options?: ToastOptions) => {
  return toast(message, {
    ...options,
    icon: <InfoIcon />,
    style: {
      borderLeft: '4px solid #3c8dbc',
      ...options?.style,
    },
  });
};

export { toast };
export default toast;
