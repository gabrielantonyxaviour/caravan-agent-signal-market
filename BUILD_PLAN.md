# BUILD_PLAN

## Product Scope

Build CARAVAN as a single-page judge surface plus replay script:

- Cinematic landing/product surface at `/`.
- Interactive signal room showing three agents.
- Live price ingestion where available.
- Deterministic replay fallback.
- Arc/Circle integration status panel and submit-ready proof packet.

## Milestones

1. 2026-05-21 06:30 IST: write execution docs and source-grounded plan.
2. 2026-05-21 07:00 IST: scaffold Next.js app and reusable CARAVAN data engine.
3. 2026-05-21 07:45 IST: implement first-screen UI, signal flow, and replay command.
4. 2026-05-21 08:15 IST: attempt Arc CLI/RPC/faucet access and wire proof status.
5. 2026-05-21 08:45 IST: run lint/build/replay/browser checks.
6. 2026-05-21 09:15 IST: write builder report and submission packet.

## Implementation Choices

- Next.js instead of a static Vite shell because submission reviewers benefit from a familiar production app shape and future API routes can be added without migration.
- `scripts/replay-demo.ts` is the acceptance spine: it must reproduce signal sale/refusal even if browser state changes.
- App data engine stays local and deterministic by default, with live data fetch layered on top.
- Chain writes are optional until testnet RPC and funded wallet are verified.

## Demo Path

1. Open CARAVAN.
2. Show live market signal freshness.
3. Agent Atlas sells a signal for `0.12 USDC`.
4. Agent Bravo pays or enters payment-ready state.
5. Agent Coda audits spread, slippage, stale decay, and Arc fee.
6. Bravo refuses execution because net edge is negative.
7. Show replay command and Arc proof status.

## Plugin/Backend/API Choices

- No Kimi code generation.
- Use Circle/Arc official docs and Circle `use-arc` skill guidance.
- Use `agent-browser` only for signed-in operational surfaces: GitHub, Google Form, Luma, faucet, Circle console.
- Use browser/public web checks for official docs.

## Verification

- `npm run lint`
- `npm run build`
- `npm run replay`
- Browser/UI proof at desktop and mobile.
- `/polish` or blocker evidence.
