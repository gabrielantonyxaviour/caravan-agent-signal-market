# Truth Audit

Hackathon: Agora Agents Hackathon
Idea: CARAVAN Agent-to-Agent Signal Market
Updated: 2026-05-22 05:26 IST

Final product status: demo-ready

| Claim | Reality: real / fixture / mock / blocked / not attempted / removed | Evidence | User-facing label needed? | Action |
|---|---|---|---|---|
| Product is working as a local/public demo | real | `npm run build` passed; `vercel deploy --prod --yes` succeeded; `curl -I https://caravan-agent-signal-market.vercel.app` returned HTTP 200; `npm run visual:qa` passed | No, but status must be `demo-ready`, not `submit-ready` | Keep demo-ready language. |
| Public repo exists | real | `gh repo view gabrielantonyxaviour/caravan-agent-signal-market` returned public repo; origin is `https://github.com/gabrielantonyxaviour/caravan-agent-signal-market.git` | No | Push hardening edits if source needs to mirror deployed app. |
| Current production app has hardened payment labels | real | Public HTML contains `Agents price...`, `Real payment proof appears only when an Arc transaction hash is configured`, `Fixture ticket`, and `Payment status` after deployment `dpl_27WhLwXN6k7ENDwmdCaFiQJ63WJg` | No | Completed in code and production deploy. |
| Live market data works | real with fallback | `npm run replay` returned `marketStatus: "live"`; CoinGecko curl returned BTC/ETH/SOL price data; visual QA clicked `Run live check` and reached `Live market frame` | Yes: UI must show `Live market frame` only after successful fetch | Keep fixture fallback visible for API failure/rate limits. |
| Deterministic replay works | real | `npm run replay -- --fixture` returned fixture refusal path; `npm test` covers fixture refusal and payment label | Yes: fixture mode must be labeled | Completed. |
| Bravo pays USDC in the current demo | fixture / payment-ready, not real payment | No Arc tx hash, no RPC token, no funded wallet; UI now says `0.12 USDC simulated ticket; no chain tx claimed` or `payment-ready` | Yes | Removed/reworded misleading `pays` language in README, execution packet, hero, ledger, metadata. |
| Real Arc/Circle transaction exists | blocked | `arc-canteen status` and `arc-canteen rpc eth_chainId` return not logged in; `npm run replay -- --submit --fixture` returns missing env blocker | Yes | Do not show Arcscan link or `confirmed` unless real tx hash exists. |
| Arc/Circle integration path is implemented | real path, blocked proof | `scripts/replay-demo.ts` has `--submit` path using `viem`; `NEXT_PUBLIC_ARC_TX_HASH` displays confirmed proof only when configured; contract compiles | Yes | Keep as integration path, not completed live integration. |
| Solidity registry is deployed | blocked / not attempted | `contracts/SignalMarketRegistry.sol` compiles with solc, but no deploy command/address/evidence exists | Yes | Label as intended registry / compile-proven only. |
| Gateway/Paymaster/EURC/Circle Wallets are integrated | removed / not claimed | README states no Gateway/Paymaster/real Arc payment is claimed; UI says no Gateway/Paymaster claim unless proof is added | No | Keep out of submission unless proof is added. |
| Formal `/polish` passed | blocked | M2 `playwright-cli-sessions browser start` failed SSH preflight to `m2worker` / `100.115.214.82:22`; report saved to `.playwright-sessions/.reports/2026-05-21T23-51-22-283-...md` | Yes | Record `formal-polish-blocked-by-m2`, not pass. |
| Local visual QA passed | real fallback | `npm run visual:qa` generated `outputs/local-visual-qa-hardening.md` and screenshots at 375, 768, 1440; primary flow reached live frame | Yes | Record as `local-visual-qa-passed; formal-polish-blocked-by-m2`. |
| Submission form is submitted | blocked | Builder report says portal fields identified, no prefill/final submit; no video URL | Yes | Do not final-submit without Gabriel approval and demo video URL. |
| Security audit is clean | real partial, blocker remains | `npm audit --omit=dev` reports 2 moderate Next/PostCSS advisories; `npm view next version` returns current installed `16.2.6` | Yes | Track as residual dependency advisory; no stable newer Next available at check time. |
