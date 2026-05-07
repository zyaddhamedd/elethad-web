import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_10px_20px_rgba(37,99,235,0.2)]",
  secondary: "bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  danger: "bg-rose-500/10 text-rose-200 border border-rose-500/20 hover:bg-rose-500/20",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm",
  md: "px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm",
  lg: "px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base",
};

export function AdminButton({
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: AdminButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}