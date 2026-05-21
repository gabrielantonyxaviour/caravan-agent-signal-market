# Builder Report: CARAVAN Agent-to-Agent Signal Market

Generated: 2026-05-21T07:01:52+05:30

## Summary

Built and deployed CARAVAN, a Next.js prototype for the Agora Agents Hackathon. The app demonstrates an agent-to-agent signal sale where Atlas publishes a market signal, Bravo buys it for `0.12 USDC`, Coda audits the route, and Bravo refuses execution when fee/slippage/latency costs erase the edge.

## Repo Status

- Public repo: `https://github.com/gabrielantonyxaviour/caravan-agent-signal-market`
- Owner verified: GitHub CLI active account `gabrielantonyxaviour`; Gabriel `Default` Chrome profile showed `Gabriel Antony Xaviour (gabrielantonyxaviour)`.
- Remote configured: `origin https://github.com/gabrielantonyxaviour/caravan-agent-signal-market.git`
- Push status: pushed `main` at commit `a21a250`.

## Deployment Status

- Vercel project: `rax-tech/caravan-agent-signal-market`
- Production alias: `https://caravan-agent-signal-market.vercel.app`
- Public smoke test: `agent-browser` loaded the public URL and found the hero, signal room, proof path, and submit packet headings.

## Submission Portal Status

- Portal: `https://docs.google.com/forms/d/e/1FAIpQLSfgDV0TLAEONtGYDKSjxusDCeqsa4prj01FhoBM2a8NTQvfmA/viewform?pli=1`
- Browser session: `caravan-submit-prep2` using Gabriel `Default` profile.
- Fields identified: email, project name, GitHub handle, Discord, Telegram, X, team count, team names, problem statement, project description, traction, source code, live URL, video demo, Circle/Arc feedback, general feedback.
- Prefill: not performed because video URL and final traction copy are not ready.
- Final submit: blocked until Gabriel explicitly authorizes it.

## Sponsor/API Status

- Official hackathon and sponsor docs were read/verified: Canteen/Circle hackathon page, Arc docs, Circle docs, Canteen ARC CLI, Arcscan, Circle faucet.
- Canteen ARC CLI installed successfully from `the-canteen-dev/ARC-cli`.
- `arc-canteen status` and `arc-canteen rpc eth_chainId` require login.
- `arc-canteen login` reached GitHub device authorization under Gabriel's profile, but the `Authorize the-canteen-dev` button remained disabled. I stopped without bypassing the disabled control.
- No real Arc transaction is claimed.
- No Gateway, Paymaster, EURC, or Circle Wallets claim is shown in the app unless future proof is added.

## UI/Template Status

- Template basis documented in `UI_TEMPLATE_PLAN.md`.
- Borrowed from Gabriel's catalog: `06-linear` structural restraint, MotionSites `innovation-landing`/`portal` liquid-glass and cinematic hero patterns, and `rivr` DeFi glass card language.
- Production screenshots captured at 1440, 768, and 375 widths under `outputs/screenshots/`.
- Visual QA note: formal `/polish` could not run because M2 Playwright was unreachable over SSH. Report filed through `playwright-cli-sessions report`.

## Build Status

- `npm install`: completed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run replay`: passed with live CoinGecko input.
- `curl -I http://localhost:3037`: returned `HTTP/1.1 200 OK`.
- Public Vercel build: passed and aliased.

## Replay Evidence

Latest `npm run replay` output used live market data and produced:

- Seller: `atlas`
- Buyer: `bravo`
- Symbol: `SOL`
- Ask: `0.12 USDC`
- Decision: `refuse`
- Net edge: negative after total costs
- Submit path: skipped until `ARC_TESTNET_RPC_URL` and `PRIVATE_KEY` are available

## Known Blockers

- Arc RPC token not minted because GitHub OAuth authorization for `SWARM-cli` showed a disabled authorize button in the browser flow.
- No funded Arc Testnet wallet yet; no Arc tx hash.
- No demo video URL yet.
- Formal `/polish` blocked by unreachable M2 worker; local fallback was not used because it requires Gabriel's explicit approval.
- `npm audit --omit=dev` reports two moderate advisories from Next's bundled PostCSS path; `npm view next version` shows `16.2.6` as latest available.

## Next Actions

1. Resolve `arc-canteen login` authorization, then run `arc-canteen rpc eth_chainId`.
2. Fund a testnet wallet through Circle faucet if CAPTCHA/passkey does not block.
3. Run `npm run replay -- --submit` and capture Arcscan URL.
4. Record a sub-3-minute demo video using the live Vercel app.
5. Fill the Google Form with repo, live URL, video URL, and concise traction/feedback copy. Stop before final submit unless Gabriel approves.
