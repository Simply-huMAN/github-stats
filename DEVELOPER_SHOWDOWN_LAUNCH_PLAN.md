# Developer Showdown UX and Launch Plan

Make Compare the year-round entry point to MyGitStats. Wrapped gives people a seasonal reason to visit, Card Studio gives them something to put on their profile, and Compare gives them a reason to send the site to someone else. A visitor should be able to open a matchup on their phone, understand the result in a few seconds, and start a comparison of their own.

The recommendations apply to PR #7. On November 21, 2026, the live homepage, robots file, and sitemap were reachable, and the live `/compare` route returned 404. [Live homepage](https://mygitstats.dev/) · [Sitemap](https://mygitstats.dev/sitemap.xml) · [PR #7](https://github.com/Simply-huMAN/github-stats/pull/7)

## Changes before launch

| Priority | Change |
| --- | --- |
| **1. Make the result trustworthy** | Treat failed GitHub requests as unavailable data. Show the metrics you could retrieve, and withhold the overall winner when missing metrics could change it. Cache complete results. Explain the scoring and tiebreaker, show when the data was fetched, and label recent activity as an estimate. The current request reads one page from GitHub’s 30-day events timeline, so update the 90-day claim or change the data source. [GitHub Events API](https://docs.github.com/en/rest/activity/events?apiVersion=2026-03-10#list-public-events-for-a-user) |
| **2. Make the first comparison easy** | Use **Compare two GitHub profiles** as the heading and **Compare profiles** as the button. Keep **Developer Showdown** as the feature name. Start with two visibly labeled fields and a one-tap **Try an example** below them. Accept handles and pasted profile URLs, keep inputs intact on retry, and show errors next to the affected field. |
| **3. Put the answer first on phones** | Keep the color-coded cards and put a compact result above them with both handles, the category score, and one meaningful difference. Put **Share** and **Compare another** above the six metric rows. Fix the 320 px overflow and tablet navigation, let metric descriptions wrap, and enlarge the profile and swap tap targets. |
| **4. Make loading and sharing reliable** | Use one fetch path per matchup, remove the two unused calendars from that request, and load the PNG exporter on demand. Make every share open the exact matchup. Fix the social preview, use the phone’s native share sheet where available, and provide **Copy link** and **Download image** as fallbacks. Export a compact card with both handles, the score, and the site name. [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API) |

Run the full flow on **iPhone Safari and Android Chrome** over a throttled connection. Include a 39-character handle, a missing account, a failed GitHub request, and a matchup link opened from a messaging app. That last test checks the first screen a recipient sees.

## Reaching the first users

1. **Use the pages MyGitStats already has.** Add a visible **Compare GitHub profiles** link near the homepage hero. On Card Studio and Wrapped results, offer **Compare this profile** with the username already filled in. On a shared result, offer **Compare your profile with @handle** so the recipient only has to enter one name.
2. **Launch with examples people can try.** Pick three matchups with an interesting story, such as a maintainer getting more stars while another leads on recent activity. Put them in the GitHub README and release notes, then share one example and a short phone demo in relevant developer communities. Invite feedback on whether the result made sense.
3. **Start search discovery with `/compare`.** The PR adds it to the sitemap. After deployment, inspect the live URL in Search Console. Use one canonical URL per indexed matchup, and start with a few curated pages that include a readable, server-rendered result and useful context. [Google’s canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
4. **Measure the path from visit to result to referral.** Track how many valid comparison attempts reach a result, how long that takes on mobile, and how many visitors arriving through a shared matchup start their own. Use these numbers to prioritize reliability, the form, or distribution. Aggregate events are enough for this funnel, so keep raw usernames out of analytics.

The first launch milestone is a reliable comparison that a visitor can understand, share, and repeat from a phone.
