import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Theme = "light" | "dark";
type TextSize = "small" | "medium" | "large";
type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("nexus_theme") as Theme) || "dark";
  });
  
  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem("nexus_text_size") as TextSize) || "medium";
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nexus_theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-text-size", textSize);
    localStorage.setItem("nexus_text_size", textSize);
  }, [textSize]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, textSize, setTextSize, showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-[14px] font-medium transition-all animate-in slide-in-from-bottom-5 fade-in duration-300 ${
              toast.type === "success" 
                ? "bg-fyp-green/10 text-fyp-green border-fyp-green/30" 
                : "bg-red-950/30 text-red-400 border-red-500/30"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {toast.message}
          </div>
        ))}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
