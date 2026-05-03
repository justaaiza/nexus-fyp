interface StatusBadgeProps {
  label: string;
  color: string;
  icon?: React.ElementType;
  size?: "sm" | "md";
}

export function StatusBadge({ label, color, icon: Icon, size = "sm" }: StatusBadgeProps) {
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1.5";
  const fontSize = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <div
      className={`inline-flex items-center gap-1 ${padding} rounded-lg ${fontSize}`}
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}35`,
      }}
    >
      {Icon && <Icon size={size === "sm" ? 11 : 13} />}
      <span>{label}</span>
    </div>
  );
}
