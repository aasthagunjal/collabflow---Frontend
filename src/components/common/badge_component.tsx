import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'solid' | 'outline';
  colorClass?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'subtle',
  colorClass = 'bg-[#eff4ff] text-[#424560]',
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center px-2 py-[2px] rounded-full text-[9px] font-bold uppercase tracking-wider leading-none select-none';

  const variantStyles = {
    subtle: colorClass,
    solid: `${colorClass.split(' ')[1]} text-white`,
    outline: `border ${colorClass}`,
  };

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
