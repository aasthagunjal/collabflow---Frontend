import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  fullScreen = false,
  color = 'border-primary',
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-t-transparent ${color} ${sizeStyles[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[200] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-md">
      {spinner}
    </div>
  );
};
export default Loader;
