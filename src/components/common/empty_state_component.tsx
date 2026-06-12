import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-xl px-lg gap-md">
      {icon && (
        <div className="w-14 h-14 bg-[#eff4ff] rounded-2xl flex items-center justify-center text-primary mb-xs">
          {icon}
        </div>
      )}
      <div className="space-y-xs max-w-sm">
        <h3 className="font-headline font-bold text-sm text-on-surface">{title}</h3>
        {description && (
          <p className="text-xs text-secondary font-sans leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="mt-xs">{action}</div>}
    </div>
  );
};
export default EmptyState;
