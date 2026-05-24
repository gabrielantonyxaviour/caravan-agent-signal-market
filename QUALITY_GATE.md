# Quality Gate

Hackathon: Agora Agents Hackathon
Idea: CARAVAN Agent-to-Agent Signal Market
Updated: 2026-05-22 07:25 IST

Final status: `auth-blocked`

| Gate | Evidence | Status |
|---|---|---|
| Unit/type/build checks | `npm run lint` passed; `npm run typecheck` passed; `npm test` passed 5/5; `npm run build` passed with routes `/` and `/api/market` | passed |
| Replay checks | `npm run replay` returned live market frame and refusal; `npm run replay -- --fixture` returned fixture refusal; `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture` returned blocked on missing env | passed with Arc submit blocked |
| Readiness E2E | `CARAVAN_E2E_URL=http://localhost:3037 npm run e2e:readiness` passed primary live flow, no-wallet blocked state, injected-provider signed session, CoinGecko proof, and visible action audit | passed |
| Integration/API/RPC/contract smoke checks | `/api/market` returned BTC/ETH/SOL; `arc-canteen status` and `arc-canteen rpc eth_chainId` returned not logged in; solc 0.8.30 produced ABI/bin under `/tmp/caravan-readiness-contract-check` | passed except Arc/Canteen auth blocked |
| Public repo/deploy state | GitHub repo is public under `gabrielantonyxaviour/caravan-agent-signal-market`; readiness changes are local and not claimed deployed | repo proven; deploy update not claimed |
| Browser proof for primary flow | `npm run visual:qa` clicked `Run live check` on local URL and reached `Live market frame`; screenshot `outputs/screenshots/hardening-1440-live.png` | passed local fallback |
| Local visual QA at 375 / 768 / 1440 | `outputs/screenshots/hardening-375-fixture.png`; `outputs/screenshots/hardening-768-fixture.png`; `outputs/screenshots/hardening-1440-fixture.png`; no horizontal overflow; hero/ledger/proof labels present | local-visual-qa-passed |
| Formal `/polish` | `PLAYWRIGHT_CLI_REMOTE=m2worker`; `browser start` failed SSH preflight timeout to `100.115.214.82:22`; report saved to `/Users/gabrielantonyxaviour/.playwright-sessions/.reports/2026-05-22T01-42-52-047-caravan-readiness-formal-polish-browser-start-fa.md` | formal-polish-blocked-by-m2 |
| Hidden mock/fake claim audit | UI and docs separate fixture/payment-ready/confirmed/blocked tx states; no Arcscan link without tx hash; no connected wallet without signed session | passed |
| Security/dependency audit | `npm audit --omit=dev` reports 2 moderate advisories from Next bundled PostCSS; `npm view next version` returned `16.2.6`, matching installed version; force fix would downgrade Next | residual-risk |
| Submission readiness | Demo can be tested locally; real Arc tx, real wallet proof, Canteen CLI auth, demo video URL, and final Google Form approval are missing | auth-blocked |

Final visual status: local-visual-qa-passed; formal-polish-blocked-by-m2
