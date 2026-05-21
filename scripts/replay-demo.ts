import {
  buildCaravanRun,
  fetchMarketFrame,
  fixtureMarket,
  stableHash,
} from "../src/lib/caravan";

type SubmitResult =
  | { status: "skipped"; reason: string }
  | { status: "submitted"; txHash: string; arcscanUrl: string }
  | { status: "blocked"; reason: string };

async function maybeSubmitTrace(traceHash: string): Promise<SubmitResult> {
  if (!process.argv.includes("--submit")) {
    return {
      status: "skipped",
      reason: "Run with --submit plus ARC_TESTNET_RPC_URL and PRIVATE_KEY to attempt an Arc memo transaction.",
    };
  }
  const rpcUrl = process.env.ARC_TESTNET_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  if (!rpcUrl || !privateKey) {
    return {
      status: "blocked",
      reason: "Missing ARC_TESTNET_RPC_URL or PRIVATE_KEY.",
    };
  }
  const [{ createWalletClient, http }, { privateKeyToAccount }, { arcTestnet }] =
    await Promise.all([
      import("viem"),
      import("viem/accounts"),
      import("viem/chains"),
    ]);
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const client = createWalletClient({
    account,
    chain: arcTestnet,
    transport: http(rpcUrl),
  });
  const data = `0x4341524156414e${traceHash.slice(2)}` as `0x${string}`;
  const txHash = await client.sendTransaction({
    account,
    to: account.address,
    data,
  });
  return {
    status: "submitted",
    txHash,
    arcscanUrl: `https://testnet.arcscan.app/tx/${txHash}`,
  };
}

async function main() {
  let market = fixtureMarket;
  let marketStatus = "fixture";
  if (!process.argv.includes("--fixture")) {
    try {
      market = await fetchMarketFrame();
      marketStatus = "live";
    } catch (error) {
      marketStatus = `fixture fallback: ${(error as Error).message}`;
    }
  }
  const initialRun = buildCaravanRun(market);
  const submit = await maybeSubmitTrace(initialRun.decision.traceHash);
  const run = buildCaravanRun(
    market,
    submit.status === "submitted" ? submit.txHash : undefined,
  );
  const result = {
    project: "CARAVAN Agent-to-Agent Signal Market",
    marketStatus,
    generatedAt: run.generatedAt,
    sale: {
      seller: run.signal.sellerAgentId,
      buyer: run.sale.buyerAgentId,
      symbol: run.signal.symbol,
      askUsdc: run.signal.askingPriceUsdc,
      evidenceHash: run.signal.evidenceHash,
      paymentStatus: run.sale.paymentStatus,
      txHash: run.sale.txHash,
    },
    decision: {
      auditor: run.decision.auditorAgentId,
      decision: run.decision.decision,
      grossEdgeBps: run.decision.grossEdgeBps,
      totalCostBps: run.decision.grossEdgeBps - run.decision.netEdgeBps,
      netEdgeBps: run.decision.netEdgeBps,
      traceHash: run.decision.traceHash,
      acceptanceId: stableHash(JSON.stringify(run.decision)),
    },
    submit,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${(error as Error).stack ?? (error as Error).message}\n`);
  process.exit(1);
});
