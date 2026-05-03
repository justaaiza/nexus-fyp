import type { ElementType } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: "rgba(59,127,232,0.08)" }}
      >
        <Icon size={24} className="text-fyp-blue" />
      </div>
      <h3 className="text-[15px] font-semibold text-fyp-text mb-1">{title}</h3>
      {description && (
        <p className="text-[13px] text-fyp-text-muted text-center max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
