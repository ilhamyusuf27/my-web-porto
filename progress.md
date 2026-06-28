# Progress
Branch: develop

## Done
- Hero: fixed spacing, CTA visible
- Status board: % bars -> recruiter-useful hiring signals
- Quest log: restored, compact
- Career map: WORK 01-03 and EDU 01-03 numbered independently
- Footer: latency, GMT+7 server time, build info, Cloudflare edge, social links
- Avatar: cleaned, bottom-anchored

## Verified
pnpm build passes - preview on 127.0.0.1:4322 - no vertical scroll desktop -
no clipped panels - no console errors

## Note
Stale dev HMR can show fresh HTML + stale scoped CSS after Astro CSS edits -
confirm via build+preview, not dev server.
Also update the progress.md after done any update