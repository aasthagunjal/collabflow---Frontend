import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-md top-1/2 -translate-y-1/2 text-outline flex items-center justify-center shrink-0">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={`w-full bg-[#f8fafc] border rounded-xl text-xs outline-none focus:ring-1 transition-all placeholder:text-outline font-medium
            ${leftIcon ? 'pl-[40px]' : 'pl-md'}
            ${rightIcon ? 'pr-[40px]' : 'pr-md'}
            ${error ? 'border-[#ffb4ab] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20' : 'border-[#c7c4d8] focus:border-primary focus:ring-primary/20'}
            py-2 ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-md top-1/2 -translate-y-1/2 text-outline flex items-center justify-center shrink-0">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-[#ba1a1a] font-medium leading-none mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
