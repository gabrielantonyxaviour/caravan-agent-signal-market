import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCaravanRun,
  fixtureMarket,
  stableHash,
  type MarketPoint,
} from "../src/lib/caravan";

test("fixture replay produces the refusal demo with labeled fixture payment", () => {
  const run = buildCaravanRun(fixtureMarket, undefined, "2026-05-21T00:00:00.000Z");

  assert.equal(run.signal.isFixture, true);
  assert.equal(run.sale.paymentStatus, "fixture");
  assert.equal(run.decision.decision, "refuse");
  assert.equal(run.decision.netEdgeBps < 0, true);
  assert.equal(run.sale.priceUsdc, 0.12);
  assert.match(run.signal.evidenceHash, /^0x[0-9a-f]{8}$/);
});

test("live market frame is marked payment-ready but not chain-confirmed without tx hash", () => {
  const liveMarket: MarketPoint[] = [
    {
      symbol: "ETH",
      name: "Ethereum",
      priceUsd: 3800,
      change24h: 3.4,
      source: "coingecko",
      updatedAt: "2026-05-21T00:01:00.000Z",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      priceUsd: 104000,
      change24h: 0.2,
      source: "coingecko",
      updatedAt: "2026-05-21T00:01:00.000Z",
    },
  ];

  const run = buildCaravanRun(liveMarket, undefined, "2026-05-21T00:01:00.000Z");

  assert.equal(run.signal.isFixture, false);
  assert.equal(run.sale.paymentStatus, "ready");
  assert.equal(run.sale.txHash, undefined);
  assert.equal(run.sale.arcscanUrl, undefined);
});

test("confirmed run links the supplied Arc transaction hash", () => {
  const txHash = `0x${"1".repeat(64)}`;
  const run = buildCaravanRun(fixtureMarket, txHash, "2026-05-21T00:02:00.000Z");

  assert.equal(run.sale.paymentStatus, "confirmed");
  assert.equal(run.sale.txHash, txHash);
  assert.equal(run.sale.arcscanUrl, `https://testnet.arcscan.app/tx/${txHash}`);
});

test("stableHash remains deterministic for report/replay acceptance ids", () => {
  assert.equal(stableHash("caravan"), stableHash("caravan"));
  assert.notEqual(stableHash("caravan"), stableHash("caravan-2"));
});
