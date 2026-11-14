import { ContributionCalendar, ContributionDay, ContributionWeek } from "@/types/stats";

/**
 * Deterministic pseudo-random number generator (LCG) based on a string seed.
 */
function createSeededRandom(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Generates a realistic, deterministic 52-week calendar seeded by username and stats.
 * Guaranteed to never throw and work completely offline.
 */
export function generateSyntheticCalendar(
  username: string,
  activeCount: number = 180,
  reposCount: number = 25
): ContributionCalendar {
  const rng = createSeededRandom(`${username}-calendar-v1`);
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  
  // 52 weeks = 364 days. Calculate start date so last day is today
  const totalDays = 52 * 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + 1);

  // Determine baseline density based on active activity and repos
  const activityDensity = Math.min(0.85, Math.max(0.18, (activeCount * 1.5 + reposCount * 3) / 450));
  let totalContributions = 0;

  for (let w = 0; w < 52; w++) {
    const contributionDays: ContributionDay[] = [];
    // Recent weeks have slightly higher momentum
    const recencyWeight = 0.8 + (w / 52) * 0.4;

    for (let d = 0; d < 7; d++) {
      const curDate = new Date(startDate);
      curDate.setDate(startDate.getDate() + (w * 7 + d));
      const dateStr = curDate.toISOString().split("T")[0];

      // Weekdays (Mon=1..Fri=5) have higher commit probability than weekends (Sun=0, Sat=6)
      const isWeekend = d === 0 || d === 6;
      const dayFactor = isWeekend ? 0.35 : 1.1;
      const roll = rng();

      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (roll < activityDensity * dayFactor * recencyWeight) {
        const intensityRoll = rng();
        if (intensityRoll > 0.85) {
          count = Math.floor(rng() * 8) + 8; // 8 - 15 commits
          level = 4;
        } else if (intensityRoll > 0.6) {
          count = Math.floor(rng() * 4) + 4; // 4 - 7 commits
          level = 3;
        } else if (intensityRoll > 0.3) {
          count = Math.floor(rng() * 2) + 2; // 2 - 3 commits
          level = 2;
        } else {
          count = 1;
          level = 1;
        }
      }

      totalContributions += count;
      contributionDays.push({
        date: dateStr,
        count,
        level,
      });
    }
    weeks.push({ contributionDays });
  }

  return {
    totalContributions,
    weeks,
  };
}

/**
 * Fetches contribution calendar from GitHub GraphQL API if token is present,
 * or public mirror API, with automatic fallback to synthetic calendar.
 */
export async function fetchContributionCalendar(
  username: string,
  token?: string,
  activeCount: number = 150,
  reposCount: number = 20
): Promise<ContributionCalendar> {
  const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

  // 1. If GITHUB_TOKEN is available, use the official GraphQL contributionsCollection
  if (token && token.trim().length > 0) {
    try {
      const query = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
          "User-Agent": "github-stats-card-app",
        },
        body: JSON.stringify({ query, variables: { login: username } }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      if (res.ok) {
        const json = await res.json();
        const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
        if (cal && Array.isArray(cal.weeks) && cal.weeks.length > 0) {
          const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          };

          const weeks: ContributionWeek[] = cal.weeks.map((w: any) => ({
            contributionDays: (w.contributionDays || []).map((d: any) => ({
              date: d.date,
              count: d.contributionCount || 0,
              level: levelMap[d.contributionLevel] ?? (d.contributionCount > 0 ? 1 : 0),
            })),
          }));

          // Take the last 52 weeks if more returned
          const trimmedWeeks = weeks.slice(-52);

          return {
            totalContributions: cal.totalContributions || 0,
            weeks: trimmedWeeks,
          };
        }
      }
    } catch {
      // Fall through to public mirror or synthetic
    }
  }

  // 2. Try public mirror API (zero auth required)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const mirrorRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      {
        headers: { "User-Agent": "github-stats-card-app" },
        signal: controller.signal,
      }
    ).finally(() => clearTimeout(timer));

    if (mirrorRes.ok) {
      const data = await mirrorRes.json();
      if (Array.isArray(data?.contributions) && data.contributions.length > 0) {
        const allDays: ContributionDay[] = data.contributions.map((c: any) => ({
          date: c.date,
          count: c.count || 0,
          level: Math.min(4, Math.max(0, c.level || 0)) as 0 | 1 | 2 | 3 | 4,
        }));

        // Group into 7-day weeks
        const weeks: ContributionWeek[] = [];
        for (let i = 0; i < allDays.length; i += 7) {
          weeks.push({
            contributionDays: allDays.slice(i, i + 7),
          });
        }

        const trimmedWeeks = weeks.slice(-52);
        const total = typeof data.total === "object" ? Object.values(data.total).reduce((a: any, b: any) => a + b, 0) : 0;

        return {
          totalContributions: Number(total) || allDays.reduce((sum, d) => sum + d.count, 0),
          weeks: trimmedWeeks,
        };
      }
    }
  } catch {
    // Fall through to synthetic
  }

  // 3. Fallback: Deterministic synthetic calendar seeded from user metrics
  return generateSyntheticCalendar(username, activeCount, reposCount);
}

