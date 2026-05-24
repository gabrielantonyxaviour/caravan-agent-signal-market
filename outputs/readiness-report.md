# Readiness Report: CARAVAN Agent-to-Agent Signal Market

Generated: 2026-05-22 07:25 IST

Final readiness status: `auth-blocked`

## Summary

CARAVAN is now ready for serious local end-to-end testing of the product surface: the local app runs, the primary live-market flow passes browser E2E, the app-side web3 wallet path is implemented, no-wallet failure is explicit, visible actions are audited, and local visual QA passes at 375/768/1440.

It is not `testing-ready` under the readiness contract because real web3 auth and Arc settlement proof are still blocked: Canteen/GitHub device authorization reaches a disabled GitHub OAuth button, `arc-canteen` remains logged out, and there is no Arc RPC URL, funded wallet key, transaction hash, contract deployment, or Arcscan proof.

Local URL used for proof: `http://localhost:3037`

Existing public demo from prior hardening: `https://caravan-agent-signal-market.vercel.app`

Current readiness changes are local and are not claimed deployed.

## Auth Implementation And Proof

Auth classification: `web3-auth`.

Implemented:
- `src/components/WalletAuthPanel.tsx` adds a real EIP-1193 wallet path.
- `src/lib/wallet-auth.ts` binds session signing to account, Arc chain `5042002`, and timestamp.
- The UI requests `eth_requestAccounts`, checks/switches to Arc chain `0x4cef52`, requests `personal_sign`, and persists only a signed session in `sessionStorage`.
- No wallet provider shows a blocked state. No connected account is displayed without a signed session. No Arc tx proof is shown without a real tx hash.

Proof:
- `CARAVAN_E2E_URL=http://localhost:3037 npm run e2e:readiness` passed.
- No-wallet failure path passed; screenshot: `outputs/readiness-e2e/no-wallet-375.png`.
- Injected EIP-1193 app-side proof passed with chain `0x4cef52`; screenshot: `outputs/readiness-e2e/wallet-connected-1440.png`.
- Real wallet extension proof is still blocked because no unlocked wallet/profile was available in the local headless proof.

## E2E Tests Added And Run

Added:
- `scripts/e2e-readiness.mjs`: CDP-based E2E for primary live flow, no-wallet failure, injected-provider wallet signing, CoinGecko proof, and visible action audit.
- `app/api/market/route.ts`: same-origin market API so browser live checks do not depend on direct client-side third-party fetch behavior.
- Unit coverage in `tests/caravan.test.ts` for wallet auth message and Arc chain binding.

Passed commands:
- `npm run lint`
- `npm run typecheck`
- `npm test` (5/5)
- `npm run build`
- `npm run replay`
- `npm run replay -- --fixture`
- `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture`
- `CARAVAN_E2E_URL=http://localhost:3037 npm run e2e:readiness`
- `CARAVAN_QA_URL=http://localhost:3037 npm run visual:qa`
- `curl -s http://127.0.0.1:3037/api/market`
- `rm -rf /tmp/caravan-readiness-contract-check && npx --yes solc@0.8.30 --bin --abi contracts/SignalMarketRegistry.sol -o /tmp/caravan-readiness-contract-check`
- `git diff --check`

## Live Integrations Proven

- CoinGecko via same-origin `/api/market`: BTC/ETH/SOL returned.
- Node replay live market frame: `npm run replay` returned `marketStatus: "live"` and `paymentStatus: "ready"`.
- Solidity source compiles to ABI/bin under `/tmp/caravan-readiness-contract-check`.
- GitHub repo is public: `gabrielantonyxaviour/caravan-agent-signal-market`.

## Blocked Integrations And Self-Service Evidence

Arc/Canteen auth:
- `arc-canteen status` returned `Not logged in. Run arc-canteen login first.`
- `arc-canteen rpc eth_chainId` returned the same blocker.
- `arc-canteen login` generated GitHub device code `6916-3154`.
- `agent-browser --session caravan-arc-login-2 --profile "Default" --allowed-domains "github.com,www.github.com"` opened GitHub and continued as `gabrielantonyxaviour`.
- GitHub reached `Authorize SWARM-cli`, but the `Authorize the-canteen-dev` button was disabled.
- Screenshot: `outputs/readiness-arc-login-disabled.png`.

Arc transaction/faucet/wallet:
- `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture` returned `status: "blocked"` with missing env reason.
- No RPC URL, private key, funded Arc Testnet wallet, transaction hash, deployed contract address, or Arcscan URL exists.

Formal polish:
- `PLAYWRIGHT_CLI_REMOTE=m2worker` was set.
- `npx playwright-cli-sessions@latest browser status` showed no attached Chrome.
- `npx playwright-cli-sessions@latest browser start` failed SSH preflight to `m2worker` / `100.115.214.82:22`.
- Report saved to `/Users/gabrielantonyxaviour/.playwright-sessions/.reports/2026-05-22T01-42-52-047-caravan-readiness-formal-polish-browser-start-fa.md`.

## Dummy/Mock Removals And Action Audit

- Dummy wallet state was replaced with real provider-driven auth and explicit blocked states.
- Browser live market fetch was moved behind `/api/market` and verified through E2E.
- Visible action audit passed with zero invalid actions for `Run live check`, `Replay deterministic fixture`, and `Connect wallet`.
- Nav links target real sections: `#room`, `#auth`, `#proof`, `#packet`.
- Fixture/payment labels remain explicit: `DEMO FIXTURE`, `Fixture ticket`, `Payment-ready`, `Tx proof blocked`.

## Screenshots

- `outputs/readiness-e2e/no-wallet-375.png`
- `outputs/readiness-e2e/wallet-connected-1440.png`
- `outputs/screenshots/hardening-375-fixture.png`
- `outputs/screenshots/hardening-768-fixture.png`
- `outputs/screenshots/hardening-1440-fixture.png`
- `outputs/screenshots/hardening-1440-live.png`
- `outputs/readiness-arc-login-disabled.png`

## Residual Risk

- `npm audit --omit=dev` still reports 2 moderate advisories in Next bundled PostCSS.
- `npm view next version` returns `16.2.6`, matching installed Next.
- `npm audit fix --force` would install `next@9.3.3`, a breaking downgrade, so it was not applied.

## Next Actions

1. Resolve GitHub OAuth authorization for `arc-canteen login` or obtain the correct Canteen account approval.
2. Run `arc-canteen status`, `arc-canteen rpc eth_chainId`, and `arc-canteen rpc-url` after login.
3. Configure a real Arc Testnet wallet/profile, switch to chain `5042002`, and capture a real wallet signature.
4. Fund the test wallet through the allowed faucet path without bypassing CAPTCHA/passkey gates.
5. Run `ARC_TESTNET_RPC_URL=... PRIVATE_KEY=... npm run replay -- --submit` and capture the Arc tx hash.
6. Set `NEXT_PUBLIC_ARC_TX_HASH`, rebuild, rerun `npm run e2e:readiness` and `npm run visual:qa`, then deploy the updated readiness build.
7. Only after real tx proof and demo video exist, prepare the submission form and stop before final submit unless Gabriel explicitly approves.
