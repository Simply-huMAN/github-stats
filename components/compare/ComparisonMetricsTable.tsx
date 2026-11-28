import { Fragment } from "react";
import type { MetricComparison } from "@/types/compare";
import { cn } from "@/lib/utils";
import { formatComparisonNumber } from "@/lib/comparisonFormat";

const labels: Record<MetricComparison["key"], { title: string; text: string }> = {
  tierScore: { title: "Tier score", text: "Weighted score from public GitHub stats" },
  totalStars: { title: "Stars", text: "Stars across public repositories" },
  followers: { title: "Followers", text: "GitHub followers" },
  activeContributions: { title: "Recent activity", text: "Estimated from recent public events" },
  publicRepos: { title: "Repositories", text: "Public repositories" },
  accountAgeDays: { title: "Account age", text: "Days since the GitHub account was created" },
};

export function ComparisonMetricsTable({ metrics, user1Name, user2Name }: {
  metrics: MetricComparison[];
  user1Name: string;
  user2Name: string;
}) {
  return (
    <section aria-labelledby="comparison-metrics" className="min-w-0">
      <h3 id="comparison-metrics" className="mb-3 text-sm font-semibold">Metric breakdown</h3>
      <div className="overflow-hidden rounded-lg border border-site-line bg-site-panel">
        <table aria-labelledby="comparison-metrics" className="w-full table-fixed text-left">
          <thead className="border-b border-site-line bg-site-inset font-mono text-[11px] text-site-muted">
            <tr>
              <th scope="col" className="w-[38%] px-2.5 py-3 font-medium sm:px-4">Metric</th>
              {[user1Name, user2Name].map((name, index) => (
                <th key={index} scope="col" className="px-2.5 py-3 text-right font-medium [overflow-wrap:anywhere] sm:px-4">@{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const total = metric.user1Value + metric.user2Value;
              const hasShare = total > 0 && metric.winner !== "undetermined";
              const firstShare = hasShare ? Math.round((metric.user1Value / total) * 100) : 0;
              const secondShare = 100 - firstShare;
              const detail = metric.winner === "undetermined" ? "Incomplete data"
                : metric.winner === "tie" ? "Tied"
                : `Gap ${formatComparisonNumber(Math.abs(metric.diff))}`;

              return (
                <Fragment key={metric.key}>
                  <tr className="border-t border-site-line align-top first:border-t-0">
                    <th scope="row" className="px-2.5 pt-3 text-xs font-medium leading-snug sm:px-4 sm:text-sm">
                      <span>{labels[metric.key].title}</span>
                      <span className="mt-1 hidden text-xs font-normal leading-snug text-site-muted sm:block">{labels[metric.key].text}</span>
                    </th>
                    {([
                      { position: 1, value: metric.user1Value, missing: metric.user1Missing },
                      { position: 2, value: metric.user2Value, missing: metric.user2Missing },
                    ] as const).map(({ position, value, missing }) => (
                      <td key={position} className="px-2.5 pt-3 text-right font-mono text-xs tabular-nums [overflow-wrap:anywhere] sm:px-4 sm:text-sm">
                        <span className={metric.winner === position ? "font-semibold text-site-green" : "text-foreground"}>
                          {missing ? "—" : formatComparisonNumber(value)}
                          {!missing && metric.unit && metric.key !== "tierScore" && ` ${metric.unit}`}
                        </span>
                        {missing && <span className="block text-[10px] text-site-muted">Missing</span>}
                        {metric.winner === position && <span className="block text-[10px] text-site-green">Leads</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-2.5 pb-3 pt-2 sm:px-4">
                      {hasShare && (
                        <div aria-hidden="true" className="mb-1.5 flex h-1 overflow-hidden rounded-sm bg-site-line">
                          <span className={metric.winner === 1 ? "bg-site-green" : "bg-site-control"} style={{ width: `${firstShare}%` }} />
                          <span className={metric.winner === 2 ? "bg-site-green" : "bg-site-muted"} style={{ width: `${secondShare}%` }} />
                        </div>
                      )}
                      <div className={cn("grid grid-cols-[1fr_auto_1fr] gap-2 font-mono text-[10px] text-site-muted", metric.winner === "undetermined" && "text-amber-300")}>
                        <span>{hasShare ? `${firstShare}%` : ""}</span>
                        <span>{detail}</span>
                        <span className="text-right">{hasShare ? `${secondShare}%` : ""}</span>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
