# E2E Test Plan

Hackathon: Agora Agents Hackathon
Idea: CARAVAN Agent-to-Agent Signal Market
Updated: 2026-05-22 07:25 IST

| Flow | Preconditions | Test command/browser proof | Expected result | Status | Blocker |
|---|---|---|---|---|---|
| Primary happy path | Local dev server on `http://localhost:3037`; CoinGecko reachable through same-origin `/api/market` route | `CARAVAN_E2E_URL=http://localhost:3037 npm run e2e:readiness`; `CARAVAN_QA_URL=http://localhost:3037 npm run visual:qa` | `Run live check` reaches `Live market frame`; live CoinGecko BTC/ETH/SOL data present; screenshots saved | passed | None for local testing. |
| Web3 auth app-side happy path | Test harness injects EIP-1193 provider; provider starts on wrong chain and supports switch/sign | `npm run e2e:readiness`; screenshot `outputs/readiness-e2e/wallet-connected-1440.png` | Connect requests account, switches to Arc chain `0x4cef52`, signs a CARAVAN message, and persists signed session | passed as app-side harness proof | Needs real wallet extension for real-wallet proof. |
| Web3 auth failure path | No browser wallet provider | `npm run e2e:readiness`; screenshot `outputs/readiness-e2e/no-wallet-375.png` | `Connect wallet` reports `Wallet connect blocked`; no fake account appears | passed | None. |
| Real integration proof | CoinGecko public API available | `curl -s http://127.0.0.1:3037/api/market`; `npm run replay` | Same-origin API returns three symbols; replay returns `marketStatus: "live"` and `paymentStatus: "ready"` | passed | Public API availability/rate limits. |
| Arc submit blocked proof | No `ARC_TESTNET_RPC_URL` and no `PRIVATE_KEY` | `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture` | Submit path exits cleanly with `status: "blocked"` and missing env reason | passed blocked-state test | Requires Canteen CLI login, RPC URL, funded wallet. |
| No-dummy action audit | Local app loaded at 375 px | `npm run e2e:readiness` action audit | Visible buttons/links have text and valid targets/actions: `Run live check`, `Replay deterministic fixture`, `Connect wallet`, anchor nav | passed | None. |
| Formal M2 polish | `PLAYWRIGHT_CLI_REMOTE=m2worker` and M2 SSH reachable | `npx playwright-cli-sessions@latest browser start` | M2-attached Chrome starts | blocked | SSH preflight to `m2worker` / `100.115.214.82:22` timed out; report `/Users/gabrielantonyxaviour/.playwright-sessions/.reports/2026-05-22T01-42-52-047-caravan-readiness-formal-polish-browser-start-fa.md`. |

Kimi readiness inventory findings (2026-05-22 07:33 IST):
- **All 5/5 unit tests passed** in this inventory run (`npm test`).
- **`npm run e2e:readiness`** passed: target `http://localhost:3037`; 3 visible actions audited, 0 invalid; no-wallet blocked state true; injected wallet connected true, chain `0x4cef52`, signature present.
- **`npm run visual:qa`** passed at 375/768/1440: hero, fixture-label, signal-ledger, proof-label all true; horizontal-overflow false; live click reached `Live market frame`.
- **`npm run replay`** returned `marketStatus: "live"` (SOL lead, `paymentStatus: "ready"`).
- **`npm run replay -- --fixture`** returned `paymentStatus: "fixture"`.
- **Blocked submit proof**: `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture` returned `status: "blocked"`, `reason: "Missing ARC_TESTNET_RPC_URL or PRIVATE_KEY."`.
- **No-dummy action audit detail**: E2E inspected 3 visible buttons (`Run live check`, `Replay deterministic fixture`, `Connect wallet`) and 4 nav anchors (`#room`, `#auth`, `#proof`, `#packet`). All have text and valid targets. No forms, inputs, or `onSubmit` handlers exist in product code.

New/updated tests:
- `tests/caravan.test.ts`: 5 unit tests including wallet auth message and Arc chain binding.
- `scripts/e2e-readiness.mjs`: CDP E2E for primary flow, auth success/failure, CoinGecko proof, and action audit.
- `scripts/local-visual-qa.mjs`: local fallback visual QA now targets current local URL and waits for hydration.
