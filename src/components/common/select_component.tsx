import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`w-full bg-[#f8fafc] border rounded-xl text-xs py-2 px-3 outline-none font-medium cursor-pointer transition-all
          ${error ? 'border-[#ffb4ab] focus:border-[#ba1a1a]' : 'border-[#c7c4d8] focus:border-primary'}
          ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[10px] text-[#ba1a1a] font-medium leading-none mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
