import type { ComparisonError } from "../types/compare";
import { validateComparisonPair, validateGitHubUsername } from "@/lib/validation";

export interface ComparisonFeedback {
  user1?: string;
  user2?: string;
  notice?: { title: string; message: string; retryAt?: string };
}

export function validateComparisonForm(user1: string, user2: string) {
  const pair = validateComparisonPair(user1, user2);
  const feedback: ComparisonFeedback = pair.isSelfComparison
    ? { user2: "Choose a different GitHub profile." }
    : {
        user1: validateGitHubUsername(user1).isValid ? undefined : "Enter a GitHub username or profile URL.",
        user2: validateGitHubUsername(user2).isValid ? undefined : "Enter a GitHub username or profile URL.",
      };
  return { pair, feedback };
}

export function getComparisonFeedback(error: Pick<ComparisonError, "code" | "failedUser" | "retryAt">): ComparisonFeedback {
  if (error.code === "NOT_FOUND" && error.failedUser) {
    const message = "We couldn’t find this GitHub profile. Check the spelling and try again.";
    return {
      user1: error.failedUser !== "user2" ? message : undefined,
      user2: error.failedUser !== "user1" ? message : undefined,
    };
  }
  if (error.code === "RATE_LIMITED") {
    return {
      notice: {
        title: "GitHub is temporarily limiting requests",
        message: "Try again shortly.",
        retryAt: error.retryAt,
      },
    };
  }
  return { notice: { title: "Couldn’t load the comparison", message: "Try again in a moment." } };
}
