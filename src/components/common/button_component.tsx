import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-headline font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';

  const variants = {
    primary: 'bg-[#4744e5] hover:bg-[#6161ff] text-white focus:ring-[#4744e5]/50 shadow-md shadow-primary/10',
    secondary: 'bg-[#e5eeff] hover:bg-[#d0e0ff] text-[#4744e5] focus:ring-[#e5eeff]/50',
    outline: 'border border-[#c7c4d8] hover:border-primary text-on-surface bg-white focus:ring-primary/20',
    text: 'text-primary hover:underline bg-transparent',
    ghost: 'hover:bg-[#eff4ff] text-secondary hover:text-primary',
    danger: 'bg-[#ffdad6] hover:bg-[#ffcdcb] text-[#ba1a1a] focus:ring-[#ffdad6]',
    success: 'bg-[#10b981]/10 hover:bg-[#10b981]/25 text-[#10b981] focus:ring-[#10b981]/10',
  };

  const sizes = {
    xs: 'px-2 py-1 text-[10px] rounded-md gap-1',
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-xs rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
export default Button;
