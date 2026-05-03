import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  borderColor?: string;
}

export function Card({ children, className = "", padding = "p-5", borderColor }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-fyp-card border ${padding} ${className}`}
      style={borderColor ? { borderColor } : undefined}
    >
      {children}
    </div>
  );
}
