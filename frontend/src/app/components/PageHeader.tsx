import type { ReactNode } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, subtitle, action, badge }: PageHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="mb-6 space-y-4">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-fyp-elevated border border-fyp-border hover:bg-fyp-card text-fyp-text-secondary transition-colors"
          title="Go Back"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center text-[13px] text-fyp-text-muted capitalize">
          <Link to="/app" className="hover:text-fyp-text transition-colors flex items-center gap-1">
            <Home size={12} />
          </Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return (
              <div key={to} className="flex items-center">
                <ChevronRight size={14} className="mx-1" />
                {isLast ? (
                  <span className="text-fyp-text font-medium">{value}</span>
                ) : (
                  <Link to={to} className="hover:text-fyp-text transition-colors">
                    {value}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Header Content */}
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
    </div>
  );
}
