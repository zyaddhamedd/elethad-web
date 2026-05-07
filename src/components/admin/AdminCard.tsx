import { cn } from "@/lib/utils";

export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:p-5 md:p-6 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}