interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900">
          {title}
        </h1>
        {description && (
          <p className="text-surface-500 mt-1 font-body text-sm">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
