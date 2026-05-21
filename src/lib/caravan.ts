export type Agent = {
  id: "atlas" | "bravo" | "coda";
  name: string;
  role: string;
  mandate: string;
  wallet: string;
  accent: "green" | "cyan" | "amber";
};

export type MarketPoint = {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  source: "coingecko" | "fixture";
  updatedAt: string;
};

export type Signal = {
  id: string;
  symbol: string;
  title: string;
  source: string;
  sellerAgentId: Agent["id"];
  observedPrice: number;
  change24h: number;
  confidence: number;
  halfLifeSeconds: number;
  askingPriceUsdc: number;
  evidenceHash: string;
  createdAt: string;
  isFixture: boolean;
};

export type SignalSale = {
  id: string;
  signalId: string;
  sellerAgentId: Agent["id"];
  buyerAgentId: Agent["id"];
  priceUsdc: number;
  paymentStatus: "fixture" | "ready" | "confirmed" | "blocked";
  txHash?: string;
  arcscanUrl?: string;
};

export type BuyerDecision = {
  id: string;
  saleId: string;
  auditorAgentId: Agent["id"];
  decision: "execute" | "refuse";
  grossEdgeBps: number;
  spreadCostBps: number;
  slippageBps: number;
  staleDecayBps: number;
  arcFeeBps: number;
  netEdgeBps: number;
  reason: string;
  traceHash: string;
};

export type CaravanRun = {
  agents: Agent[];
  market: MarketPoint[];
  signal: Signal;
  sale: SignalSale;
  decision: BuyerDecision;
  generatedAt: string;
};

export const ARC_TESTNET = {
  chainId: 5042002,
  explorer: "https://testnet.arcscan.app",
  usdc: "0x3600000000000000000000000000000000000000",
  eurc: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
};

export const agents: Agent[] = [
  {
    id: "atlas",
    name: "Atlas",
    role: "Signal seller",
    mandate: "Sell alpha that is too stale for Atlas' own mandate.",
    wallet: "0xa71a...a911",
    accent: "green",
  },
  {
    id: "bravo",
    name: "Bravo",
    role: "Signal buyer",
    mandate: "Buy only if a signal can clear cost accounting in one block.",
    wallet: "0xb2a0...41cc",
    accent: "cyan",
  },
  {
    id: "coda",
    name: "Coda",
    role: "Execution auditor",
    mandate: "Reject trades where fees, spread, or latency erase the edge.",
    wallet: "0xc0da...77ef",
    accent: "amber",
  },
];

export const fixtureMarket: MarketPoint[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    priceUsd: 104842.12,
    change24h: 1.18,
    source: "fixture",
    updatedAt: "2026-05-21T00:00:00.000Z",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    priceUsd: 3812.44,
    change24h: -0.82,
    source: "fixture",
    updatedAt: "2026-05-21T00:00:00.000Z",
  },
  {
    symbol: "SOL",
    name: "Solana",
    priceUsd: 184.21,
    change24h: 2.36,
    source: "fixture",
    updatedAt: "2026-05-21T00:00:00.000Z",
  },
];

export function stableHash(input: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `0x${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export async function fetchMarketFrame(): Promise<MarketPoint[]> {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true";
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`CoinGecko returned ${response.status}`);
  }
  const data = (await response.json()) as Record<
    string,
    { usd: number; usd_24h_change: number; last_updated_at?: number }
  >;
  return [
    ["bitcoin", "BTC", "Bitcoin"],
    ["ethereum", "ETH", "Ethereum"],
    ["solana", "SOL", "Solana"],
  ].map(([id, symbol, name]) => ({
    symbol,
    name,
    priceUsd: data[id]?.usd ?? 0,
    change24h: data[id]?.usd_24h_change ?? 0,
    source: "coingecko" as const,
    updatedAt: new Date((data[id]?.last_updated_at ?? Date.now() / 1000) * 1000)
      .toISOString(),
  }));
}

export function buildCaravanRun(
  market: MarketPoint[] = fixtureMarket,
  txHash?: string,
  generatedAtInput?: string,
): CaravanRun {
  const generatedAt = generatedAtInput ?? new Date().toISOString();
  const sorted = [...market].sort(
    (left, right) => Math.abs(right.change24h) - Math.abs(left.change24h),
  );
  const lead = sorted[0] ?? fixtureMarket[0];
  const reference = sorted[1] ?? fixtureMarket[1];
  const spread = Math.abs(lead.change24h - reference.change24h);
  const grossEdgeBps = Math.max(42, Math.round(spread * 18 + 28));
  const spreadCostBps = 36;
  const slippageBps = 52;
  const staleDecayBps = 44;
  const arcFeeBps = 4;
  const netEdgeBps =
    grossEdgeBps - spreadCostBps - slippageBps - staleDecayBps - arcFeeBps;
  const signalBase = `${lead.symbol}:${lead.priceUsd}:${lead.change24h}:${generatedAt}`;
  const evidenceHash = stableHash(signalBase);
  const signal: Signal = {
    id: `sig-${evidenceHash.slice(2)}`,
    symbol: lead.symbol,
    title: `${lead.symbol} momentum divergence versus ${reference.symbol}`,
    source: lead.source === "coingecko" ? "CoinGecko public market frame" : "Fixture market frame",
    sellerAgentId: "atlas",
    observedPrice: lead.priceUsd,
    change24h: lead.change24h,
    confidence: Math.min(0.88, 0.51 + spread / 20),
    halfLifeSeconds: 42,
    askingPriceUsdc: 0.12,
    evidenceHash,
    createdAt: generatedAt,
    isFixture: lead.source === "fixture",
  };
  const sale: SignalSale = {
    id: `sale-${stableHash(`${signal.id}:bravo`).slice(2)}`,
    signalId: signal.id,
    sellerAgentId: "atlas",
    buyerAgentId: "bravo",
    priceUsdc: signal.askingPriceUsdc,
    paymentStatus: txHash ? "confirmed" : signal.isFixture ? "fixture" : "ready",
    txHash,
    arcscanUrl: txHash ? `${ARC_TESTNET.explorer}/tx/${txHash}` : undefined,
  };
  const trace = `${sale.id}:${grossEdgeBps}:${netEdgeBps}:refuse`;
  const decision: BuyerDecision = {
    id: `decision-${stableHash(trace).slice(2)}`,
    saleId: sale.id,
    auditorAgentId: "coda",
    decision: netEdgeBps > 0 ? "execute" : "refuse",
    grossEdgeBps,
    spreadCostBps,
    slippageBps,
    staleDecayBps,
    arcFeeBps,
    netEdgeBps,
    reason:
      netEdgeBps > 0
        ? "Net edge cleared the buyer risk threshold."
        : "Signal was worth buying as information, but not worth executing after costs.",
    traceHash: stableHash(trace),
  };
  return { agents, market, signal, sale, decision, generatedAt };
}
