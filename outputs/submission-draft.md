# Submission Draft — CARAVAN Agent-to-Agent Signal Market

Form: https://docs.google.com/forms/d/e/1FAIpQLSfgDV0TLAEONtGYDKSjxusDCeqsa4prj01FhoBM2a8NTQvfmA/viewform
Draft created: 2026-05-24
Status: DRAFT — DO NOT SUBMIT without Gabriel's approval

---

## Field Values

### Email *
gabrielantony56@gmail.com

### Project Name *
CARAVAN Agent-to-Agent Signal Market

### GitHub Handle (include all handles if team) *
gabrielantonyxaviour

### Discord Handle *
⚠️ MISSING — Gabriel must provide his Discord handle before submission.
Placeholder: (Gabriel's Discord handle)

### Telegram Handle *
⚠️ MISSING — Gabriel must provide his Telegram handle before submission.
Placeholder: (Gabriel's Telegram @username)

### Twitter / X Profile
https://x.com/gabrielaxyeth

### Number of Team Members *
1 (Solo)

### Team Members Names *
Gabriel Antony Xaviour

### Problem Statement *
AI agents have no efficient native market to buy and sell market signals from each other. When one agent generates an alpha signal it cannot act on (due to risk mandate, capital constraints, or latency), that signal decays unused. Meanwhile, other agents that could act on it have no discovery mechanism. Human intermediaries break the latency requirements of autonomous agent commerce. CARAVAN solves this by giving agents a programmable signal market on Arc where value flows directly from signal generator to signal consumer, with honest cost accounting forcing a real execute/refuse decision before any payment clears.

### Project Description *
CARAVAN is a working agent-to-agent signal market built on Arc's USDC settlement layer, submitted for the Agora Agents Hackathon.

Three agents orchestrate the core loop with zero human approval clicks:

- **Atlas (seller)**: Observes live BTC/ETH/SOL price data from CoinGecko. When a price move exceeds its signal threshold, it marks the signal for sale at 0.12 USDC.
- **Bravo (buyer)**: Receives the signal ticket and evaluates whether to pay. Bravo queries a fee table via the auditor before committing.
- **Coda (auditor)**: Calculates the true net edge: gross signal strength minus spread, slippage, stale decay, and Arc fee. Returns a signed audit trace.
- **Decision**: Bravo executes if net edge is positive, refuses if negative. In the demo, the refusal is the winning moment — the system correctly walks away from a losing trade.

**Tech stack**: Next.js 16 (React 19), Tailwind CSS v4, viem for Arc Testnet RPC interaction, Canteen Arc CLI (arc-canteen) for wallet/settlement, CoinGecko public API for live price data. The replay-demo.ts script is a standalone CLI tool: `npm run replay` (live), `npm run replay -- --fixture` (deterministic), `npm run replay -- --submit` (Arc memo tx with credentials).

The WalletAuthPanel implements EIP-1193 account request, Arc Testnet chain validation (chainId 0x4cef52), personal_sign for session binding, and disconnect — all without a wallet library dependency.

### Traction *
- Public GitHub repo: 7 commits, complete codebase, replayable by anyone
- Live Vercel deployment: https://caravan-agent-signal-market.vercel.app
- Automated test suite: 5/5 passing (fixture replay, live market frame, confirmed tx path, hash determinism, wallet auth message binding)
- Replay script: anyone can run `npm run replay` to get a live market decision in seconds
- Arc CLI integration: arc-canteen installed and configured; blocked on GitHub OAuth disabled button in browser flow (documented in READINESS_GATE.md)
- CoinGecko integration: live BTC/ETH/SOL prices feeding the signal engine

### Project Source Code *
https://github.com/gabrielantonyxaviour/caravan-agent-signal-market

### Project Live
https://caravan-agent-signal-market.vercel.app

### Project Video Demo *
⚠️ MISSING — demo video has not been recorded yet. Required before final submission.
Recommended: record a 2-3 minute Loom showing the live app, replay command, and the refusal decision.

### (Arc OSS) Apply for Arc Open Source Showcase?
✅ Yes — I would love to apply for Arc OSS! I can commit to keeping my code open source!

### (Arc OSS) Why should we choose your project?
CARAVAN exposes three reusable primitives that other Arc builders can fork directly:

1. **Agent signal sale pattern** (`scripts/replay-demo.ts`): A standalone TypeScript CLI that prices a market signal, runs cost accounting, and sends an Arc memo transaction if net edge is positive. Fork it to add your own signal logic.

2. **WalletAuthPanel** (`src/components/WalletAuthPanel.tsx`): A zero-dependency EIP-1193 component that handles Arc Testnet chain validation, personal_sign session binding, and disconnect. Works with MetaMask, Rabby, or any injected provider.

3. **Auditor fee table** (`src/components/CaravanExperience.tsx`): A configurable cost-accounting model (spread + slippage + decay + Arc fee in basis points) that forces honest execute/refuse decisions. Adaptable to any Arc settlement flow.

Compared to the `circlefin/arc-*` repos, CARAVAN adds: (a) agent-to-agent commerce semantics vs. single-party payment flows; (b) a refusal mechanism with cost-accounting trace; (c) a live signal engine that pulls real market data; (d) a deterministic fixture mode for CI/testing.

### Circle / Arc Feedback
Arc's settlement memo pattern is elegant — a small USDC transaction with a structured memo hash is a clean primitive for agent-to-agent commerce. The arc-canteen CLI was easy to install and the RPC/faucet discovery was smooth.

Blockers we hit:
1. **GitHub OAuth button was disabled** in the browser flow for `arc-canteen login`. The "Authorize the-canteen-dev" button rendered but was non-clickable. This blocked login without a workaround. A headless/API-first auth path (e.g., personal access token or env-var key) would unblock automated agents entirely.
2. **Testnet faucet** required a Circle account login that wasn't cached. A public-key-only faucet endpoint (like ETH testnets) would reduce friction.
3. **Documentation gap**: the Arc docs cover the happy path well but don't show what happens when an agent refuses a payment — i.e., the "no transaction = correct outcome" case. Documenting the refusal pattern would help builders model negative decisions.

Improvement asks:
- Headless auth (PAT or env key) for arc-canteen CLI
- Documented refusal/negative-decision pattern
- Per-chain faucet curl commands in the quickstart

### General Feedback
The Agora hackathon concept is excellent — agents transacting with agents on Arc is exactly the right primitive to build toward. The structure of the submission (Google Form, clear judging criteria) was easy to work with.

What worked: Clear Arc OSS showcase incentive, the Canteen CLI was the right entry point, CoinGecko integration for live price data was painless.

What didn't: The GitHub OAuth disabled-button issue was frustrating and undocumented. We spent time debugging the auth flow only to find the browser control was broken. 

Suggestion: A "testnet smoke test" script in the Arc quickstart that verifies auth + RPC + faucet + first transaction in one command would dramatically reduce first-hour friction for new builders.

---

## Missing before submission (Gabriel must supply)

1. ❌ **Discord handle** — required field
2. ❌ **Telegram handle** — required field  
3. ❌ **Demo video URL** — required field (Loom/YouTube/Vimeo, max 3 min)

## Optional improvements before submission

4. ⚠️ Arc tx hash — if Canteen OAuth can be resolved, adds real tx proof
5. ⚠️ More traction (stars, testers, RTs) — update traction field before submitting
