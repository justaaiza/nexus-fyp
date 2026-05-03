import type { ElementType } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  color: string;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-fyp-card border border-fyp-border">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={16} color={color} />
        </div>
      </div>
      <p className="text-xl font-bold text-fyp-text">{value}</p>
      <p className="text-xs text-fyp-text-secondary mt-0.5">{label}</p>
    </div>
  );
}

interface StatCardSimpleProps {
  label: string;
  value: string | number;
  color: string;
}

export function StatCardSimple({ label, value, color }: StatCardSimpleProps) {
  return (
    <div className="p-4 rounded-2xl bg-fyp-card border border-fyp-border">
      <p className="text-[28px] font-bold" style={{ color }}>{value}</p>
      <p className="text-[13px] text-fyp-text-secondary mt-0.5">{label}</p>
    </div>
  );
}
