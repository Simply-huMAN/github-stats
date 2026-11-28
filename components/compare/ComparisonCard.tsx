import type { StatsResponse } from "@/types/stats";
import { ArrowUpRight } from "lucide-react";
import { formatComparisonNumber } from "@/lib/comparisonFormat";
import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  data: StatsResponse;
  isOverallWinner: boolean;
  contenderLabel: string;
}

export function ComparisonCard({ data, isOverallWinner, contenderLabel }: ComparisonCardProps) {
  const { user, tier } = data;
  const joinYear = new Date(user.createdAt).getUTCFullYear();
  const avatar = user.avatarUrl && `/api/avatar/${encodeURIComponent(user.username)}?url=${encodeURIComponent(user.avatarUrl)}`;

  return (
    <article className={cn(
      "flex min-w-0 flex-col rounded-lg border bg-site-panel p-3 sm:p-4",
      isOverallWinner ? "border-site-green" : "border-site-line"
    )}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-mono text-[11px] text-site-muted">
        <span>{contenderLabel}</span>
        {isOverallWinner && <span className="text-site-green">Winner</span>}
      </div>

      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-md border border-site-line bg-site-inset font-mono text-sm text-site-muted sm:size-12">
          <span aria-hidden="true">{user.username.slice(0, 2).toUpperCase()}</span>
          {avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="absolute inset-0 size-full object-cover"
              onError={(event) => { event.currentTarget.hidden = true; }}
            />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug [overflow-wrap:anywhere] sm:text-base">{user.name || user.username}</h3>
          <a
            href={user.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 max-w-full items-center gap-1 rounded font-mono text-xs text-site-muted hover:text-foreground"
            aria-label={`Open @${user.username}'s GitHub profile`}
          >
            <span className="[overflow-wrap:anywhere]">@{user.username}</span>
            <ArrowUpRight size={12} className="shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>

      <p className="mt-2 font-mono text-[11px] leading-relaxed text-site-muted">
        {data.isPartial ? "Tier score unavailable" : `${tier.tier} · ${formatComparisonNumber(tier.score)} pts`}
      </p>
      {user.bio && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-site-muted [overflow-wrap:anywhere]">{user.bio}</p>}

      {Boolean(joinYear || user.company || user.location) && (
        <div className="mt-auto pt-3">
          <ul className="flex flex-wrap gap-x-3 gap-y-1 border-t border-site-line pt-2 text-[11px] text-site-muted [overflow-wrap:anywhere]">
            {joinYear ? <li className="font-mono">Since {joinYear}</li> : null}
            {user.company && <li>{user.company}</li>}
            {user.location && <li>{user.location}</li>}
          </ul>
        </div>
      )}
    </article>
  );
}
