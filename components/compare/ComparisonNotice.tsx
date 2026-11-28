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
      "w-full rounded-md border bg-site-inset p-3 text-left sm:p-4",
      tone === "error" ? "border-rose-800" : "border-amber-800"
    )}>
      <div role={tone === "error" ? "alert" : "status"} className="flex items-start gap-2.5">
        <Icon aria-hidden="true" className={cn(
          "mt-0.5 h-4 w-4 shrink-0",
          tone === "error" ? "text-rose-300" : "text-amber-300"
        )} />
        <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <div className="mt-0.5 text-sm leading-relaxed text-site-muted">{children}</div>
        </div>
      </div>
      {action && <div className="mt-2.5 pl-[26px]">{action}</div>}
    </div>
  );
}
