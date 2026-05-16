import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 24, className = '' }) => {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-brand-600 ${className}`}
    />
  );
};

export const FullPageSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size={40} />
  </div>
);

export default Spinner;
