# SPONSOR_ACCESS_PLAN

## Official Sponsor Surfaces

- Hackathon site: `https://agora.thecanteenapp.com/`
- Submission form: `https://forms.gle/ok3Gr9zhmHnApvK48`
- Priority registration: `https://luma.com/7i50p2r9` with passphrase `SITEx1313`
- Canteen Arc RPC docs: `https://arc-node.thecanteenapp.com/`
- Arc docs: `https://docs.arc.io/` and `https://docs.arc.io/llms.txt`
- Circle developer docs: `https://developers.circle.com/` and `https://developers.circle.com/llms.txt`
- Circle public faucet: `https://faucet.circle.com`
- Arc explorer: `https://testnet.arcscan.app`
- Canteen ARC CLI: `uv tool install git+https://github.com/the-canteen-dev/ARC-cli.git`

## Current Verified Sponsor Facts

- Event: Agora Agents Hackathon by Canteen x Circle, running May 11, 2026 through May 25, 2026.
- Required final artifacts: public GitHub repo and recorded demo video; live product link is encouraged.
- Judging emphasis: agentic sophistication, traction, Circle tool usage, and innovation.
- Arc Testnet chain ID: `5042002`.
- Arc Testnet USDC token: `0x3600000000000000000000000000000000000000`.
- Arc Testnet EURC token: `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`.
- Public faucet supports Arc Testnet USDC/EURC and is protected by reCAPTCHA, so automated faucet access may stop at CAPTCHA.
- Canteen RPC URL format is `https://rpc.testnet.arc-node.thecanteenapp.com/v1/<key>` and requires `arc-canteen login`.

## Access Attempts To Run

1. Check whether `uv` and `arc-canteen` are installed. Status: `uv` present; `arc-canteen` installed on 2026-05-21.
2. Install the Canteen ARC CLI if missing. Status: installed from `the-canteen-dev/ARC-cli` commit `541810f`.
3. Run read-only CLI status/context commands first. Status: `arc-canteen status` and `arc-canteen rpc eth_chainId` both require login.
4. Attempt `arc-canteen login` with the selected GitHub identity if it can proceed without password/passkey/CAPTCHA. Status: reached GitHub device authorization under Gabriel profile; the `Authorize the-canteen-dev` control stayed disabled, so login was stopped without bypass.
5. Generate a local testnet wallet only for testnet use. Status: pending until RPC access is available.
6. Use Circle faucet for Arc Testnet USDC only if the browser flow can be completed without CAPTCHA/passkey/password handoff. Status: pending.
7. If funded, deploy or call the CARAVAN registry and capture Arcscan proof. Status: pending.

## Real Demo State Transition

CARAVAN must prove this transition:

`live public market data -> seller agent signal -> buyer agent USDC-priced payment -> buyer agent fee/slippage decision -> execute/refuse record -> Arc-visible proof or explicitly labeled local proof artifact`

The demo climax is the buyer refusal: the buyer pays for a signal but refuses execution because edge is below cost after Arc fee, spread, slippage, and latency decay.

## Fallback Policy

- If no RPC key or funded wallet is available, the app must label the run as `fixture/demo data` for chain state while still using live market input where possible.
- If Gateway is not accessible, scope CARAVAN to direct Arc USDC micro-transfers.
- If even direct Arc writes are blocked, keep `scripts/replay-demo.ts` as the deterministic proof path and write the exact missing credential/funding blocker in `outputs/builder-report.md`.
