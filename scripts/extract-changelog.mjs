import fs from "fs";

const version = process.argv[2] || process.env.RELEASE_VERSION;
if (!version) {
  console.error("[extract-changelog] Error: No version provided.");
  process.exit(1);
}

const cleanVersion = version.replace(/^v/, "").trim();
const changelogPath = "CHANGELOG.md";

if (!fs.existsSync(changelogPath)) {
  console.warn(`[extract-changelog] ${changelogPath} not found. Creating fallback notes.`);
  fs.writeFileSync("release_notes.md", `## What's Changed in v${cleanVersion}\n\nSee commits below.`);
  process.exit(0);
}

const changelog = fs.readFileSync(changelogPath, "utf8");
const lines = changelog.split(/\r?\n/);
let capturing = false;
const extracted = [];

for (const line of lines) {
  if (line.match(/^## \[[0-9]+\.[0-9]+\.[0-9]+\]/)) {
    if (line.includes(`[${cleanVersion}]`)) {
      capturing = true;
      continue;
    } else if (capturing) {
      break;
    }
  }
  if (capturing) {
    if (line.trim() === "---") continue;
    extracted.push(line);
  }
}

const notes = extracted.join("\n").trim();
const output = notes
  ? `## What's Changed in v${cleanVersion}\n\n${notes}`
  : `## What's Changed in v${cleanVersion}\n\nRelease v${cleanVersion} updates and enhancements.`;

fs.writeFileSync("release_notes.md", output);
console.log(`[extract-changelog] Successfully extracted release notes for v${cleanVersion}:\n`);
console.log(output);
