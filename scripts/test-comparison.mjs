// Pure Node.js ESM test suite for GitHub Comparison validation & engine
const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function validateGitHubUsername(input) {
  if (!input || typeof input !== "string") {
    return { isValid: false, cleanUsername: "", error: "Username is required." };
  }
  let cleaned = input.trim().replace(/^@+/, "");
  if (cleaned.includes("github.com/")) {
    const afterDomain = cleaned.split("github.com/")[1];
    const firstSegment = afterDomain?.split("/")[0]?.split(/[?#]/)[0];
    if (firstSegment) cleaned = firstSegment.replace(/^@+/, "");
  }
  if (!cleaned) return { isValid: false, cleanUsername: "", error: "Username cannot be empty." };
  if (cleaned.length > 39) {
    return { isValid: false, cleanUsername: cleaned, error: "Username exceeds max length of 39." };
  }
  if (!GITHUB_USERNAME_REGEX.test(cleaned)) {
    return { isValid: false, cleanUsername: cleaned, error: "Username format is invalid." };
  }
  return { isValid: true, cleanUsername: cleaned };
}

function validateComparisonPair(raw1, raw2) {
  const v1 = validateGitHubUsername(raw1);
  const v2 = validateGitHubUsername(raw2);
  if (!v1.isValid) return { isValid: false, error: v1.error, isSelfComparison: false };
  if (!v2.isValid) return { isValid: false, error: v2.error, isSelfComparison: false };
  if (v1.cleanUsername.toLowerCase() === v2.cleanUsername.toLowerCase()) {
    return {
      isValid: false,
      isSelfComparison: true,
      error: "Cannot compare a developer with themselves.",
      canonical1: v1.cleanUsername.toLowerCase(),
      canonical2: v2.cleanUsername.toLowerCase(),
    };
  }
  const sorted = [v1.cleanUsername.toLowerCase(), v2.cleanUsername.toLowerCase()].sort();
  return {
    isValid: true,
    user1: v1.cleanUsername,
    user2: v2.cleanUsername,
    canonical1: sorted[0],
    canonical2: sorted[1],
    isSelfComparison: false,
  };
}

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

console.log("=== 1. Testing GitHub Username Regex & Validation ===");
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
  ["  torvalds  ", "torvalds"],
  ["https://github.com/torvalds/settings", "torvalds"],
];
for (const [input, expected] of sanitizeCases) {
  const res = validateGitHubUsername(input);
  assert(res.isValid, `'${input}' should be valid after sanitization`);
  assert(res.cleanUsername === expected, `'${input}' cleaned should be '${expected}'`);
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

console.log("\n=== 2. Testing Pair Validation & Canonical Ordering ===");
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

console.log("\n=== 3. Testing Tiebreaker & Incomplete Metric Logic ===");
function simulateShowdown({ u1Wins, u2Wins, u1Score, u2Score, u1Name, u2Name, undetermined = 0 }) {
  let overallWinner = "tie";
  let isTiebreaker = false;
  let winnerWithheld = false;

  const winGap = Math.abs(u1Wins - u2Wins);
  if (undetermined > 0 && winGap <= undetermined) {
    overallWinner = "undetermined";
    winnerWithheld = true;
    return {
      overallWinner,
      winnerWithheld,
      headline: "Incomplete GitHub Data · Winner Withheld",
      winMargin: "Winner withheld due to missing metrics",
    };
  }

  if (u1Wins > u2Wins) {
    overallWinner = 1;
    return {
      overallWinner,
      winnerWithheld: false,
      headline: `${u1Name} leads with ${u1Wins} category wins.`,
      winMargin: `${u1Wins} to ${u2Wins} categories`,
    };
  } else if (u2Wins > u1Wins) {
    overallWinner = 2;
    return {
      overallWinner,
      winnerWithheld: false,
      headline: `${u2Name} leads with ${u2Wins} category wins.`,
      winMargin: `${u2Wins} to ${u1Wins} categories`,
    };
  } else {
    // Tied on category wins: Tiebreaker by tier score
    if (u1Score > u2Score) {
      overallWinner = 1;
      isTiebreaker = true;
      return {
        overallWinner,
        winnerWithheld: false,
        headline: `${u1Wins} categories each · ${u1Name} wins on tier score.`,
        winMargin: `${u1Wins} categories each · ${u1Name} wins on tier score`,
      };
    } else if (u2Score > u1Score) {
      overallWinner = 2;
      isTiebreaker = true;
      return {
        overallWinner,
        winnerWithheld: false,
        headline: `${u1Wins} categories each · ${u2Name} wins on tier score.`,
        winMargin: `${u1Wins} categories each · ${u2Name} wins on tier score`,
      };
    } else {
      return {
        overallWinner: "tie",
        winnerWithheld: false,
        headline: `Dead Heat! ${u1Name} and ${u2Name} are evenly matched.`,
        winMargin: `Tied at ${u1Wins} categories each`,
      };
    }
  }
}

// 3 to 3 tiebreaker test
const tieRes = simulateShowdown({ u1Wins: 3, u2Wins: 3, u1Score: 450, u2Score: 320, u1Name: "Linus", u2Name: "Contender" });
assert(tieRes.overallWinner === 1, "Linus should win 3-3 tie on tier score");
assert(tieRes.headline === "3 categories each · Linus wins on tier score.", "Headline should clearly explain tie and tiebreaker");
assert(tieRes.winMargin === "3 categories each · Linus wins on tier score", "Win margin should match tiebreaker format");

// Incomplete data withholding test
const withheldRes = simulateShowdown({ u1Wins: 3, u2Wins: 2, u1Score: 400, u2Score: 300, u1Name: "User1", u2Name: "User2", undetermined: 1 });
assert(withheldRes.overallWinner === "undetermined", "Winner should be withheld when missing 1 metric could tie or flip the result");
assert(withheldRes.winnerWithheld === true, "winnerWithheld flag should be true");

console.log(`\n========================================`);
console.log(`Test Summary: ${passedTests} / ${totalTests} assertions passed.`);
if (passedTests === totalTests) {
  console.log("ALL UNIT TESTS PASSED! 🚀");
} else {
  console.error("SOME TESTS FAILED!");
  process.exit(1);
}
