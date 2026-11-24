import type { ReactNode } from "react";
import { AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComparisonNotice({
  title,
  children,
  tone = "error",
  action,
}: {
  title: string;
  children: ReactNode;
  tone?: "error" | "warning";
  action?: ReactNode;
}) {
  const Icon = tone === "error" ? AlertCircle : Info;
  return (
    <div className={cn(
      "w-full rounded-xl border p-3.5 text-left sm:p-4",
      tone === "error" ? "border-rose-900 bg-rose-950/40" : "border-amber-900 bg-amber-950/40"
    )}>
      <div role={tone === "error" ? "alert" : "status"} className="flex items-start gap-2.5">
        <Icon aria-hidden="true" className={cn(
          "mt-0.5 h-4 w-4 shrink-0",
          tone === "error" ? "text-rose-300" : "text-amber-300"
        )} />
        <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          <p className="text-sm font-semibold text-zinc-100">{title}</p>
          <div className="mt-0.5 text-sm leading-relaxed text-zinc-300">{children}</div>
        </div>
      </div>
      {action && <div className="mt-2.5 pl-[26px]">{action}</div>}
    </div>
  );
}
