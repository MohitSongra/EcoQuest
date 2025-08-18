import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'purple';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', color = 'green', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const colorClasses = {
    green: 'border-green-600',
    blue: 'border-blue-600',
    purple: 'border-purple-600'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      {text && (
        <p className="mt-4 text-gray-600 text-center">{text}</p>
      )}
    </div>
  );
}
