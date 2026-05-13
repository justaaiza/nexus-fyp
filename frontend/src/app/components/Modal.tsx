import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, subtitle, children, footer, maxWidth = "max-w-md" }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <div
        className={`w-full ${maxWidth} rounded-2xl p-6 max-h-[90vh] overflow-y-auto bg-fyp-card border border-fyp-border`}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-fyp-text">{title}</h3>
            {subtitle && (
              <p className="text-[13px] text-fyp-text-secondary mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-fyp-text-muted hover:text-fyp-text-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {children}

        {footer && <div className="flex gap-3 mt-6">{footer}</div>}
      </div>
    </div>
  );
}
