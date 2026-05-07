import { cn } from "@/lib/utils";

type Column = {
  label: string;
  align?: "start" | "center" | "end";
};

type Row = {
  id: string | number;
  cells: React.ReactNode[];
};

export function AdminTable({
  columns,
  rows,
  className,
}: {
  columns: Column[];
  rows: Row[];
  className?: string;
}) {
  return (
    <>
      {/* Desktop Table View */}
      <div className={cn("hidden lg:block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(2,6,23,0.28)]", className)}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-right">
            <thead className="bg-white/5">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.label}
                    className={cn(
                      "px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400",
                      column.align === "center" && "text-center",
                      column.align === "end" && "text-left"
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/10 transition-colors hover:bg-white/5">
                  {row.cells.map((cell, index) => (
                    <td key={index} className="px-5 py-4 text-sm text-slate-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.28)] transition-colors hover:bg-white/8"
          >
            <div className="space-y-3">
              {columns.map((column, index) => (
                <div key={column.label} className="flex flex-col gap-1">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    {column.label}
                  </span>
                  <span className="text-sm text-slate-200 break-words">
                    {row.cells[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}