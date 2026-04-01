import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, subtitle, action, badge }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-[22px] font-bold text-fyp-text">{title}</h1>
        {subtitle && (
          <p className="text-sm text-fyp-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      {(action || badge) && (
        <div className="flex items-center gap-3">
          {badge}
          {action}
        </div>
      )}
    </div>
  );
}
