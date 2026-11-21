/**
 * GitHub Username Validation and Normalization Utilities.
 * Strictly enforces official GitHub username format rules.
 */

export const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export interface ValidationResult {
  isValid: boolean;
  cleanUsername: string;
  error?: string;
}

export interface PairValidationResult {
  isValid: boolean;
  user1: string;
  user2: string;
  canonical1: string;
  canonical2: string;
  isSelfComparison: boolean;
  error?: string;
}

/**
 * Sanitizes an input string or pasted GitHub URL into a clean username.
 */
export function sanitizeGitHubUsername(input: string | null | undefined): string {
  if (!input || typeof input !== "string") return "";
  let cleaned = input.trim().replace(/^@+/, "");
  if (cleaned.includes("github.com/")) {
    const afterDomain = cleaned.split("github.com/")[1];
    const firstSegment = afterDomain?.split("/")[0]?.split(/[?#]/)[0];
    if (firstSegment) {
      cleaned = firstSegment.replace(/^@+/, "");
    }
  }
  return cleaned;
}

/**
 * Sanitizes and validates a single GitHub username.
 */
export function validateGitHubUsername(input: string | null | undefined): ValidationResult {
  if (!input || typeof input !== "string") {
    return {
      isValid: false,
      cleanUsername: "",
      error: "Username is required.",
    };
  }

  const cleaned = sanitizeGitHubUsername(input);

  if (!cleaned) {
    return {
      isValid: false,
      cleanUsername: "",
      error: "Username cannot be empty.",
    };
  }

  if (cleaned.length > 39) {
    return {
      isValid: false,
      cleanUsername: cleaned,
      error: `Username '${cleaned}' exceeds GitHub's maximum length of 39 characters.`,
    };
  }

  if (!GITHUB_USERNAME_REGEX.test(cleaned)) {
    return {
      isValid: false,
      cleanUsername: cleaned,
      error: `Username '${cleaned}' is invalid. GitHub usernames can only contain alphanumeric characters and single hyphens, and cannot start or end with a hyphen.`,
    };
  }

  return {
    isValid: true,
    cleanUsername: cleaned,
  };
}

/**
 * Validates a comparison pair of GitHub usernames before making API calls.
 */
export function validateComparisonPair(
  rawUser1: string | null | undefined,
  rawUser2: string | null | undefined
): PairValidationResult {
  const v1 = validateGitHubUsername(rawUser1);
  const v2 = validateGitHubUsername(rawUser2);

  if (!v1.isValid) {
    return {
      isValid: false,
      user1: v1.cleanUsername,
      user2: v2.cleanUsername,
      canonical1: "",
      canonical2: "",
      isSelfComparison: false,
      error: `Contender 1 error: ${v1.error}`,
    };
  }

  if (!v2.isValid) {
    return {
      isValid: false,
      user1: v1.cleanUsername,
      user2: v2.cleanUsername,
      canonical1: "",
      canonical2: "",
      isSelfComparison: false,
      error: `Contender 2 error: ${v2.error}`,
    };
  }

  const isSelf = v1.cleanUsername.toLowerCase() === v2.cleanUsername.toLowerCase();
  if (isSelf) {
    return {
      isValid: false,
      user1: v1.cleanUsername,
      user2: v2.cleanUsername,
      canonical1: v1.cleanUsername.toLowerCase(),
      canonical2: v2.cleanUsername.toLowerCase(),
      isSelfComparison: true,
      error: "Cannot compare a developer with themselves. Please enter two different GitHub usernames.",
    };
  }

  // Alphabetical canonical ordering to prevent duplicate content SEO indexing
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
