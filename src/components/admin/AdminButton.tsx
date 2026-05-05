import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_10px_20px_rgba(37,99,235,0.2)]",
  secondary: "bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  danger: "bg-rose-500/10 text-rose-200 border border-rose-500/20 hover:bg-rose-500/20",
};

export function AdminButton({
  variant = "secondary",
  icon,
  className,
  children,
  ...props
}: AdminButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}