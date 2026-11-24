// Direct integration test suite running against ACTUAL production handlers & engines
import {
  validateGitHubUsername,
  validateComparisonPair,
  sanitizeGitHubUsername,
} from "../lib/validation.ts";
import { buildUserComparison } from "../lib/comparisonEngine.ts";
import { formatComparisonDate, formatComparisonNumber } from "../lib/comparisonFormat.ts";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log("=== 1. Testing Production GitHub Username Regex & Validation ===");
const validCases = ["torvalds", "Simply-huMAN", "a", "123-abc", "shadcn", "leerob", "k-e-n-t", "a-1"];
for (const u of validCases) {
  const res = validateGitHubUsername(u);
  assert(res.isValid, `'${u}' should be valid`);
  assert(res.cleanUsername === u, `'${u}' cleanUsername should match`);
}

const sanitizeCases = [
  ["@torvalds", "torvalds"],
  ["@@shadcn", "shadcn"],
  ["https://github.com/leerob", "leerob"],
  ["https://github.com/torvalds?tab=repositories", "torvalds"],
  ["  torvalds  ", "torvalds"],
  ["https://github.com/torvalds/settings", "torvalds"],
];
for (const [input, expected] of sanitizeCases) {
  const res = validateGitHubUsername(input);
  assert(res.isValid, `'${input}' should be valid after sanitization`);
  assert(res.cleanUsername === expected, `'${input}' cleaned should be '${expected}'`);
  assert(sanitizeGitHubUsername(input) === expected, `'${input}' sanitizeGitHubUsername should match '${expected}'`);
}

const invalidCases = [
  "",
  "   ",
  "-starts-with-hyphen",
  "ends-with-hyphen-",
  "consecutive--hyphens",
  "has.period",
  "has_underscore",
  "has space",
  "a".repeat(40),
  "invalid$char",
  "user#name",
];
for (const u of invalidCases) {
  const res = validateGitHubUsername(u);
  assert(!res.isValid, `'${u}' should be rejected as invalid`);
}

console.log("\n=== 2. Testing Production Pair Validation & Canonical Ordering ===");
const p1 = validateComparisonPair("torvalds", "shadcn");
assert(p1.isValid, "torvalds vs shadcn should be valid pair");
assert(p1.canonical1 === "shadcn", "canonical1 should be shadcn (alphabetical)");
assert(p1.canonical2 === "torvalds", "canonical2 should be torvalds (alphabetical)");
assert(!p1.isSelfComparison, "isSelfComparison should be false");

const p2 = validateComparisonPair("torvalds", "torvalds");
assert(!p2.isValid, "torvalds vs torvalds should fail validation");
assert(p2.isSelfComparison, "isSelfComparison should be true");

const p3 = validateComparisonPair("Simply-huMAN", "simply-human");
assert(!p3.isValid, "Simply-huMAN vs simply-human should fail validation");
assert(p3.isSelfComparison, "Case-insensitive self comparison should be detected");

console.log("\n=== 3. Testing Production buildUserComparison Engine (Actual Code) ===");

function createMockUser(username, overrides = {}) {
  const {
    name = username,
    score = 300,
    tier = "Gold",
    stars = 1000,
    followers = 500,
    contributions = 150,
    repos = 30,
    createdAt = "2015-01-01T00:00:00Z",
    isPartial = false,
    missingFields = [],
  } = overrides;

  return {
    user: {
      username,
      name,
      avatarUrl: `https://avatars.githubusercontent.com/${username}`,
      bio: "Test developer bio",
      company: "Open Source",
      location: "San Francisco",
      blog: null,
      twitterUsername: null,
      createdAt,
      htmlUrl: `https://github.com/${username}`,
    },
    stats: {
      followers,
      publicRepos: repos,
      totalStars: stars,
      activeContributions: contributions,
    },
    tier: {
      tier,
      score,
      title: `${tier} Tier`,
      description: "Tier details",
      badgeLabel: `${tier} Rank`,
      colors: {
        badgeBg: "",
        badgeText: "",
        badgeBorder: "",
        gradient: "",
        glow: "",
        textAccent: "",
        cardBorder: "",
      },
    },
    fetchedAt: new Date().toISOString(),
    isPartial,
    missingFields: isPartial ? missingFields : undefined,
  };
}

// Test A: Clear majority victory
const u1Majority = createMockUser("alpha", { score: 500, stars: 2000, followers: 800, contributions: 300, repos: 50, createdAt: "2012-01-01T00:00:00Z" });
const u2Majority = createMockUser("beta", { score: 150, stars: 50, followers: 40, contributions: 20, repos: 10, createdAt: "2020-01-01T00:00:00Z" });
const compMajority = buildUserComparison(u1Majority, u2Majority);
assert(compMajority.summary.overallWinner === 1, "Alpha should win by clear majority");
assert(compMajority.summary.isTiebreaker === false, "Majority win is not a tiebreaker");
assert(compMajority.summary.user1Wins > compMajority.summary.user2Wins, "Alpha should have more category wins");
assert(compMajority.summary.isComplete === true, "Complete data should have isComplete true");
assert(!compMajority.summary.winnerWithheld, "Winner should not be withheld on complete data");

// Test B: 3 to 3 tiebreaker decided by Tier Score
const u1Tie = createMockUser("linus", {
  name: "Linus",
  score: 650, // Higher tier score wins the tiebreaker!
  stars: 50000, // Win 1
  followers: 40000, // Win 2
  createdAt: "2008-01-01T00:00:00Z", // Win 3 (Seniority)
  contributions: 50, // Loss 1
  repos: 15, // Loss 2
});
const u2Tie = createMockUser("alex", {
  name: "Alex",
  score: 420, // Lower tier score loses tiebreaker
  stars: 1000, // Loss 1
  followers: 2000, // Loss 2
  createdAt: "2018-01-01T00:00:00Z", // Loss 3
  contributions: 400, // Win 1
  repos: 80, // Win 2
  // Tier score is Loss 3 for Alex, but wait: rawMetrics includes tierScore as a category!
  // In rawMetrics: 6 categories: tierScore, totalStars, followers, activeContributions, publicRepos, accountAgeDays.
  // Linus: tierScore (win), totalStars (win), followers (win), accountAgeDays (win) => 4 wins!
  // To get exactly 3 vs 3 category wins:
  // Let Alex win tierScore or another category:
});

// Let's create an exact 3 to 3 category tie:
// Categories:
// 1. tierScore: u1 (450) vs u2 (400) -> u1 wins
// 2. totalStars: u1 (5000) vs u2 (6000) -> u2 wins
// 3. followers: u1 (2000) vs u2 (1500) -> u1 wins
// 4. activeContributions: u1 (100) vs u2 (200) -> u2 wins
// 5. publicRepos: u1 (30) vs u2 (50) -> u2 wins
// 6. accountAgeDays: u1 (2012) vs u2 (2016) -> u1 wins
// u1 wins: tierScore, followers, seniority (3 wins)
// u2 wins: totalStars, contributions, repos (3 wins)
// Tier score tiebreaker: u1 has 450 > u2 has 400!
const u1ExactTie = createMockUser("linus", {
  name: "Linus",
  score: 450,
  stars: 5000,
  followers: 2000,
  contributions: 100,
  repos: 30,
  createdAt: "2012-01-01T00:00:00Z",
});
const u2ExactTie = createMockUser("contender", {
  name: "Contender",
  score: 400,
  stars: 6000,
  followers: 1500,
  contributions: 200,
  repos: 50,
  createdAt: "2016-01-01T00:00:00Z",
});

const compTie = buildUserComparison(u1ExactTie, u2ExactTie);
assert(compTie.summary.user1Wins === 3, `Linus should have 3 wins (got ${compTie.summary.user1Wins})`);
assert(compTie.summary.user2Wins === 3, `Contender should have 3 wins (got ${compTie.summary.user2Wins})`);
assert(compTie.summary.isTiebreaker === true, "isTiebreaker should be true on 3-3 tie");
assert(compTie.summary.overallWinner === 1, "Linus should win the tiebreaker on tier score");
assert(
  compTie.summary.headline === "3 categories each · Linus wins on tier score.",
  `Headline should be '3 categories each · Linus wins on tier score.' (got '${compTie.summary.headline}')`
);
assert(
  compTie.summary.winMargin === "3 categories each · Linus wins on tier score",
  `Win margin should match tiebreaker format (got '${compTie.summary.winMargin}')`
);

// Test C: Incomplete Data & Withheld Winner
// If GitHub failed to return active contributions for user2:
const u1Full = createMockUser("developer1", { score: 350, stars: 500, followers: 200, contributions: 100, repos: 20 });
const u2Missing = createMockUser("developer2", {
  score: 300,
  stars: 600,
  followers: 250,
  contributions: 0,
  repos: 10,
  isPartial: true,
  missingFields: ["activeContributions"],
});
const compWithheld = buildUserComparison(u1Full, u2Missing);
assert(compWithheld.summary.isComplete === false, "isComplete should be false when data is missing");
assert(compWithheld.summary.winnerWithheld === true, "winnerWithheld should be true when missing data could alter winner");
assert(compWithheld.summary.overallWinner === "undetermined", "overallWinner should be 'undetermined' when winner is withheld");
assert(compWithheld.summary.headline.includes("Winner Withheld"), "Headline should inform user that winner is withheld");

console.log("\n=== 4. Testing the comparison API with controlled GitHub responses ===");
// Compile Next.js source modules so the Node test can resolve the same @/ imports.
const require = createRequire(import.meta.url);
const modules = new Map();
function loadSource(path) {
  if (modules.has(path)) return modules.get(path).exports;
  const module = { exports: {} };
  modules.set(path, module);
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const loadDependency = (name) => name.startsWith("@/") ? loadSource(`${name.slice(2)}.ts`) : require(name);
  new Function("require", "module", "exports", outputText)(loadDependency, module, module.exports);
  return module.exports;
}

const { GET } = loadSource("app/api/compare/route.ts");
const { NextRequest } = require("next/server");
const realFetch = globalThis.fetch;
try {
  for (const scenario of ["healthy", "rejected repository", "repository 503", "invalid repository JSON", "invalid events JSON", "invalid event item"]) {
    globalThis.fetch = async (url) => {
      const request = new URL(url);
      assert(request.hostname === "api.github.com", "The compare API only requests GitHub");
      const [, , username, endpoint] = request.pathname.split("/");
      const beta = username === "betadev";
      if (!endpoint) {
        return Response.json({
          login: username, name: username, public_repos: 12, followers: 3, created_at: "2020-01-01T00:00:00Z",
        });
      }
      if (endpoint === "repos") {
        if (beta && scenario === "rejected repository") throw new TypeError("GitHub connection lost");
        if (beta && scenario === "repository 503") return new Response(null, { status: 503 });
        if (beta && scenario === "invalid repository JSON") return new Response("{invalid");
        return Response.json([{ stargazers_count: beta ? 40 : 20 }]);
      }
      if (beta && scenario === "invalid events JSON") return new Response("{invalid");
      if (beta && scenario === "invalid event item") return Response.json([null]);
      return Response.json([{ type: "PushEvent", payload: { size: beta ? 10 : 2 } }]);
    };

    const response = await GET(new NextRequest("http://localhost/api/compare?u1=alphadev&u2=betadev"));
    const data = await response.json();
    const complete = scenario === "healthy";
    const affectedMetric = scenario.includes("repository") ? "totalStars" : "activeContributions";
    assert(response.status === 200, `${scenario} returns a usable comparison response`);
    assert(data.summary.isComplete === complete, `${scenario} reports the right completeness`);
    assert(data.summary.overallWinner === (complete ? 2 : "undetermined"), `${scenario} reports the right winner`);
    assert(response.headers.get("cache-control").startsWith(complete ? "public" : "no-store"), `${scenario} uses the right cache policy`);
    assert(complete || data.user2.missingFields.includes(affectedMetric), `${scenario} correctly surfaces missing data`);
  }
} finally {
  globalThis.fetch = realFetch;
}

assert(formatComparisonNumber(1309345.5) === "1,309,345.5", "Comparison numbers use deterministic grouping");
assert(formatComparisonDate("2026-11-22T17:32:00Z").includes("5:32 PM UTC"), "Comparison timestamps use UTC");

const { getComparisonFeedback, validateComparisonForm } = loadSource("lib/comparisonFeedback.ts");
const emptyFeedback = validateComparisonForm("", "").feedback;
assert(Boolean(emptyFeedback.user1 && emptyFeedback.user2 && !emptyFeedback.notice), "Both empty fields get inline feedback");
const duplicateFeedback = validateComparisonForm("@torvalds", "https://github.com/TORVALDS").feedback;
assert(duplicateFeedback.user2 === "Choose a different GitHub profile." && !duplicateFeedback.user1, "A duplicate profile flags only the second field");

const retryAt = "2026-11-22T17:32:00.000Z";
try {
  for (const scenario of [
    { statuses: [404, 200], status: 404, fields: ["user1"] },
    { statuses: [404, 404], status: 404, fields: ["user1", "user2"] },
    { statuses: [404, 429], status: 429, fields: [] },
    { statuses: [503, 404], status: 503, fields: [] },
  ]) {
    globalThis.fetch = async (url) => {
      const [, , username, endpoint] = new URL(url).pathname.split("/");
      if (endpoint) return Response.json([]);
      const status = scenario.statuses[username === "alphadev" ? 0 : 1];
      return Response.json(
        { login: username, name: username, public_repos: 0, followers: 0, created_at: "2020-01-01T00:00:00Z" },
        { status, headers: { "x-ratelimit-reset": String(Date.parse(retryAt) / 1000) } }
      );
    };
    const response = await GET(new NextRequest("http://localhost/api/compare?u1=alphadev&u2=betadev"));
    const feedback = getComparisonFeedback(await response.json());
    const fields = ["user1", "user2"].filter((field) => feedback[field]);
    assert(response.status === scenario.status, `Profile responses ${scenario.statuses.join("/")} return the expected status`);
    assert(fields.join() === scenario.fields.join() && Boolean(feedback.notice) === (fields.length === 0), "Feedback identifies missing fields or surfaces one recovery notice");
    if (scenario.status === 429) {
      assert(feedback.notice?.retryAt === retryAt, "Rate limiting preserves the GitHub retry time");
    }
  }
} finally {
  globalThis.fetch = realFetch;
}

console.log(`\n========================================`);
console.log(`Test Summary: ${passedTests} / ${totalTests} assertions passed.`);
if (passedTests === totalTests) {
  console.log("ALL REAL PRODUCTION ENGINE TESTS PASSED! 🚀");
} else {
  console.error("SOME TESTS FAILED!");
  process.exit(1);
}
