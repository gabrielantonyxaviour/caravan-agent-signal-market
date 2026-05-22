# Hardening Report: CARAVAN Agent-to-Agent Signal Market

Generated: 2026-05-22 05:28 IST

Final status: demo-ready

## Summary

CARAVAN now has a real public demo, replayable local proof, production browser proof, and honest fixture/payment labeling. It is not submit-ready because the real Arc/Canteen login/RPC path, funded wallet, Arc transaction hash, demo video URL, and final submission approval are still missing.

Public demo: `https://caravan-agent-signal-market.vercel.app`

Latest production deployment: `dpl_27WhLwXN6k7ENDwmdCaFiQJ63WJg`

Latest pushed source commit: `0795f2c`

## Changes Made

- Updated `.Codex/state/CURRENT_SPEC.md` and `STATE.json` for this hardening pass and `demo-ready` status.
- Reworded misleading payment language in `README.md`, `EXECUTION_PACKET.md`, `app/layout.tsx`, and the hero copy.
- Updated `src/components/SignalRoom.tsx` so the ledger says `Fixture ticket`, `Payment-ready`, or `Bravo paid` based on actual proof state.
- Updated `src/components/ProofSections.tsx` with an explicit payment-status row and `live market frame; no Arc tx configured` labeling.
- Added `tests/caravan.test.ts` plus `npm test` and `npm run typecheck` scripts.
- Added `scripts/local-visual-qa.mjs` and `npm run visual:qa` for local fallback screenshots and primary-flow proof.
- Updated `FEATURE_MATRIX.md`, `INTEGRATION_MATRIX.md`, `TRUTH_AUDIT.md`, `QUALITY_GATE.md`, and `outputs/visual-qa.md`.
- Deployed the hardened app to Vercel production.
- Pushed hardening source and proof artifacts to `origin/main`.

## Checks Run

| Check | Result |
|---|---|
| `npm run lint` | passed |
| `npm run typecheck` | passed |
| `npm test` | passed, 4/4 |
| `npm run build` | passed |
| `npm run replay` | passed with live CoinGecko market frame and refusal |
| `npm run replay -- --fixture` | passed with labeled fixture refusal |
| `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture` | blocked as expected on missing env |
| CoinGecko curl smoke | passed for BTC/ETH/SOL price fields |
| `arc-canteen status` / `arc-canteen rpc eth_chainId` | blocked: not logged in |
| `npx --yes solc@0.8.30 --bin --abi contracts/SignalMarketRegistry.sol -o /tmp/caravan-contract-check` | passed |
| `npm audit --omit=dev` | failed with 2 moderate Next/PostCSS advisories; `npm view next version` is still `16.2.6` |
| `vercel deploy --prod --yes` | passed and aliased production |
| `curl -I https://caravan-agent-signal-market.vercel.app` | HTTP 200 |
| `git push origin main` | passed, pushed `0795f2c` |
| `git diff --check` | passed |

## Visual Proof

Formal `/polish`: blocked by M2.

M2 evidence: `PLAYWRIGHT_CLI_REMOTE=m2worker`; `playwright-cli-sessions browser start` failed SSH preflight to `100.115.214.82:22`. Report saved to `/Users/gabrielantonyxaviour/.playwright-sessions/.reports/2026-05-21T23-51-22-283-caravan-formal-polish-attempt-from-hardening-pas.md`.

Local fallback status: local-visual-qa-passed; formal-polish-blocked-by-m2

Local visual QA report: `outputs/local-visual-qa-hardening.md`

Screenshots:

- `outputs/screenshots/hardening-375-fixture.png`
- `outputs/screenshots/hardening-768-fixture.png`
- `outputs/screenshots/hardening-1440-fixture.png`
- `outputs/screenshots/hardening-1440-live.png`

The local QA script verified hero, fixture label, signal ledger, proof label, no horizontal overflow at 375/768/1440, and the `Run live check` click path reaching `Live market frame`.

## Real Integrations Proven

- Public Vercel deployment is live and aliased.
- GitHub repo exists, is public under `gabrielantonyxaviour/caravan-agent-signal-market`, and includes hardening commit `0795f2c`.
- CoinGecko public market data works for the replay and browser live-check path.
- Solidity registry source compiles to ABI/bytecode.
- Arc submit path exists in `scripts/replay-demo.ts` and blocks safely without credentials.

## Fixtures, Mocks, And Labels

- Fixture market data remains in `fixtureMarket` and is labeled `DEMO FIXTURE`.
- Fixture/payment-ready ticket states are explicit in the ledger and proof panel.
- No Arcscan link appears without a real tx hash.
- No Gateway, Paymaster, EURC, Circle Wallets, mainnet trading, custody, or final submission claim is made.
- `README.md`, `EXECUTION_PACKET.md`, `TRUTH_AUDIT.md`, and `QUALITY_GATE.md` all label the no-transaction state.

## Blockers

- Canteen ARC CLI is not logged in; `arc-canteen rpc eth_chainId` cannot run.
- No `ARC_TESTNET_RPC_URL`, no `PRIVATE_KEY`, and no funded Arc testnet wallet are available.
- No real Arc transaction hash or Arcscan proof exists.
- No deployed `SignalMarketRegistry` contract address exists.
- No demo video URL exists.
- Google Form final submission and legal attestations remain blocked until Gabriel explicitly approves.
- Formal M2 `/polish` remains blocked by SSH timeout to `m2worker`.
- `npm audit --omit=dev` has 2 moderate Next/PostCSS advisories with no newer stable Next version available at check time.

## Exact Next Actions

1. Resolve Canteen/GitHub device authorization for `arc-canteen login`.
2. Run `arc-canteen rpc eth_chainId` and record the successful chain ID.
3. Fund an Arc testnet wallet without bypassing CAPTCHA/passkey gates.
4. Run `ARC_TESTNET_RPC_URL=... PRIVATE_KEY=... npm run replay -- --submit` and capture the Arcscan URL.
5. Set `NEXT_PUBLIC_ARC_TX_HASH` to the real tx hash, rebuild, deploy, and rerun `npm run visual:qa`.
6. Record a sub-3-minute demo video using the hardened production URL.
7. Fill the Google Form with repo, live URL, video URL, and final copy; stop before final submit unless Gabriel explicitly approves.
