# Truth Audit

Hackathon: Agora Agents Hackathon
Idea: CARAVAN Agent-to-Agent Signal Market
Updated: 2026-05-22 07:25 IST

Final product status: `auth-blocked`

| Claim | Reality: real / fixture / mock / blocked / not attempted / removed | Evidence | User-facing label needed? | Action |
|---|---|---|---|---|
| Product is working as a local end-to-end test target | real | `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run e2e:readiness`, and `npm run visual:qa` passed on local code | No, but final readiness is `auth-blocked`, not `testing-ready` | Keep local testing-ready evidence separate from Arc auth blocker. |
| Public repo exists | real | `gh repo view gabrielantonyxaviour/caravan-agent-signal-market --json nameWithOwner,visibility,url` returned public repo | No | Proven. |
| Current readiness code is deployed | not claimed | This pass did not run a Vercel deploy after adding wallet auth and `/api/market` | Yes | Do not claim public URL includes readiness changes until deployed. |
| Live market data works in browser | real with fallback | `/api/market` returned BTC/ETH/SOL; `npm run e2e:readiness` and `npm run visual:qa` reached `Live market frame` | Yes: UI shows `Live market frame` only after successful fetch | Completed same-origin route fix. |
| Deterministic replay works | real | `npm run replay -- --fixture` returned fixture refusal path; `npm test` covers fixture refusal and payment label | Yes: fixture mode labeled | Completed. |
| Wallet auth exists | real app-side path; real-wallet proof blocked | `WalletAuthPanel` requests EIP-1193 account, Arc chain switch, and `personal_sign`; E2E injected-provider proof passed | Yes | Keep status as implemented but real-wallet proof blocked. |
| No-wallet auth failure is handled | real | `npm run e2e:readiness` passed no-wallet failure and screenshot `outputs/readiness-e2e/no-wallet-375.png` | Yes | Completed. |
| Bravo pays USDC in the current demo | fixture / payment-ready, not real payment | No Arc tx hash, no RPC token, no funded wallet; UI says fixture/payment-ready/tx proof blocked | Yes | Do not use confirmed payment language. |
| Real Arc/Circle transaction exists | blocked | `arc-canteen status` and `arc-canteen rpc eth_chainId` return not logged in; blocked submit proof returns missing env | Yes | Do not show Arcscan link or `confirmed` unless real tx hash exists. |
| Arc/Canteen login was attempted self-service | real attempt, blocked | `arc-canteen login` device flow plus `agent-browser --profile "Default"` reached disabled `Authorize the-canteen-dev` button; screenshot `outputs/readiness-arc-login-disabled.png` | Yes | Record as auth blocker. |
| Solidity registry is deployed | blocked / not attempted | Contract compiles, but no deploy command/address/evidence exists | Yes | Label as compile-proven only. |
| Gateway/Paymaster/EURC/Circle Wallets are integrated | removed / not claimed | UI/report state no Gateway/Paymaster claim unless proof is added | No | Keep out of submission unless proof lands. |
| Formal `/polish` passed | blocked | M2 browser start failed SSH preflight; report saved under `.playwright-sessions/.reports/2026-05-22T01-42-52-047-...md` | Yes | Record `formal-polish-blocked-by-m2`, not pass. |
| Local visual QA passed | real fallback | `CARAVAN_QA_URL=http://localhost:3037 npm run visual:qa` generated screenshots at 375/768/1440 and live click proof | Yes | Record as local fallback only. |
| Submission form is submitted | blocked | Not attempted; no video URL; final submit requires explicit approval | Yes | Do not final-submit. |
| Security audit is clean | residual-risk | `npm audit --omit=dev` reports 2 moderate Next/PostCSS advisories; latest Next is installed at `16.2.6`; force fix would downgrade to `next@9.3.3` | Yes | Track residual dependency advisory. |
