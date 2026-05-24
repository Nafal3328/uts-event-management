import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-surface-400" />
      </div>
      <h3 className="font-display text-lg font-semibold text-surface-800 mb-1">
        {title}
      </h3>
      <p className="text-surface-500 font-body text-sm max-w-xs">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
