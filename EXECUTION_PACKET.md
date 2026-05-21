# EXECUTION_PACKET

## Project

CARAVAN Agent-to-Agent Signal Market

## One-Liner

CARAVAN lets AI agents sell stale or unused market signals to other agents for tiny USDC payments on Arc, then makes the buyer agent publicly execute or refuse after fee and slippage accounting.

## README Core

CARAVAN is a working prototype for the Agora Agents Hackathon. It demonstrates agent-to-agent market behavior: a seller agent observes a public price signal, a buyer agent pays for it, and an auditor agent forces a final execute/refuse decision. The winning demo moment is a refusal, not a trade: the buyer pays for information but declines execution because the net edge is negative after spread, slippage, signal decay, and Arc fees.

## Demo Script

1. "This is CARAVAN, an agent-to-agent signal market on Arc."
2. "Atlas found a public market signal but cannot use it within its own risk mandate."
3. "Bravo pays 0.12 USDC for the signal because Arc finality is fast enough for stale information markets."
4. "Coda audits the edge: gross signal, spread, slippage, stale decay, and Arc fee."
5. "Bravo refuses execution because the real net edge is negative."
6. "The sale and refusal are replayable in the repo, and the Arc status panel shows whether this run has real tx proof or fixture proof."

## Video Script

- 0:00-0:15: State the one-liner and show three agents.
- 0:15-0:45: Trigger or replay live signal fetch.
- 0:45-1:20: Show USDC sale ticket and payment/proof status.
- 1:20-2:00: Open fee table and show the refusal.
- 2:00-2:30: Show replay command, Arc/Circle integration path, and tx hash if available.
- 2:30-3:00: Map to judging criteria and traction ask.

## Judging Criteria Mapping

- Agentic sophistication: agents decide to sell, buy, audit, execute, or refuse without a human approval click in the core loop.
- Traction: counts agent participants, replay runs, external testers, and feedback notes.
- Circle usage: USDC-priced signal sale, Arc Testnet transaction path, faucet/RPC integration attempt, and future Gateway path if proven.
- Innovation: market for machine-to-machine alpha, with refusal and cost accounting as the product.

## Links

- Hackathon: `https://agora.thecanteenapp.com/`
- Arc docs: `https://docs.arc.io/`
- Circle docs: `https://developers.circle.com/`
- Repo: `https://github.com/gabrielantonyxaviour/caravan-agent-signal-market`
- Live product: `https://caravan-agent-signal-market.vercel.app`
- Demo video: pending

## Final Checklist

- [x] Public repo created under verified owner.
- [x] Live app URL created.
- [ ] Demo video recorded.
- [ ] `npm run replay` output captured.
- [ ] Arc tx hash or exact blocker recorded.
- [ ] Submission form drafted.
- [ ] Gabriel approves final submit.
