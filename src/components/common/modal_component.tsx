import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-[400px]',
    md: 'max-w-[500px]',
    lg: 'max-w-[650px]',
    xl: 'max-w-[800px]',
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-md">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className={`bg-white border border-border-subtle rounded-2xl w-full ${sizeStyles[size]} p-lg shadow-2xl animate-scale-up flex flex-col gap-md relative z-[101]`}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-xs">
          <div className="flex items-center gap-sm">
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            <h3 className="font-headline font-bold text-sm text-on-surface">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-secondary hover:bg-surface-container active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {children}
        </div>

      </div>
    </div>
  );
};
export default Modal;
