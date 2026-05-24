# CARAVAN Agent-to-Agent Signal Market

CARAVAN is a prototype for the Agora Agents Hackathon by Canteen x Circle.
It demonstrates a narrow agent-to-agent market loop:

1. Atlas sees a public market signal it cannot use.
2. Bravo prices a tiny USDC ticket for that signal.
3. Coda audits spread, slippage, stale decay, and Arc fee.
4. Bravo executes or refuses; the demo is designed to make refusal the climax.

The project never claims a real Arc transaction unless one is configured. Live
market data, payment-ready state, and fixture chain proof are visibly separated
in the app.

## Auth Decision

CARAVAN is a web3-auth product. The browser surface now uses an EIP-1193 wallet
provider for auth: connect account, verify Arc Testnet chain `5042002`, request
a signature, and persist only the signed session in `sessionStorage`. If no
wallet provider, RPC URL, funded key, or transaction hash is available, the app
shows a blocked state instead of a fake connected wallet or fake Arc payment.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3037`.

## Replay

```bash
npm run replay
npm run replay -- --fixture
```

To attempt an Arc memo transaction after RPC and testnet funding are available:

```bash
ARC_TESTNET_RPC_URL="https://rpc.testnet.arc-node.thecanteenapp.com/v1/..." \
PRIVATE_KEY="0x..." \
npm run replay -- --submit
```

## Proof Surfaces

- `SPONSOR_ACCESS_PLAN.md` documents the official Canteen/Circle surfaces.
- `API_PLAN.md` defines the agent, signal, sale, and decision model.
- `UI_TEMPLATE_PLAN.md` records the Gabriel template lineage.
- `EXECUTION_PACKET.md` contains README, video script, demo script, and checklist.
- `contracts/SignalMarketRegistry.sol` is the intended Arc event registry.

## Current Integration State

- Live public market data works through CoinGecko.
- The deterministic replay command works.
- The Canteen ARC CLI installs successfully.
- `arc-canteen login` reached GitHub device authorization, but the GitHub
  authorization button was disabled in the automated browser session, so no RPC
  token was minted yet.
- No Gateway, Paymaster, or real Arc payment is claimed.
