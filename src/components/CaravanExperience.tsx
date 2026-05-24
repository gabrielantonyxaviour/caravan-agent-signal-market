"use client";

import { useState } from "react";
import {
  CaravanRun,
  type MarketPoint,
  buildCaravanRun,
  fixtureMarket,
} from "@/src/lib/caravan";
import { CaravanNav } from "@/src/components/CaravanNav";
import { HeroPanel } from "@/src/components/HeroPanel";
import { ProofSections } from "@/src/components/ProofSections";
import { SignalRoom } from "@/src/components/SignalRoom";
import { WalletAuthPanel } from "@/src/components/WalletAuthPanel";

const proofTx = process.env.NEXT_PUBLIC_ARC_TX_HASH;
const initialTimestamp = "2026-05-21T00:00:00.000Z";

async function fetchBrowserMarketFrame(): Promise<MarketPoint[]> {
  const response = await fetch("/api/market", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Market route returned ${response.status}`);
  }
  const data = (await response.json()) as {
    ok: boolean;
    market?: MarketPoint[];
    error?: string;
  };
  if (!data.ok || !data.market) {
    throw new Error(data.error ?? "Market route returned no market frame.");
  }
  return data.market;
}

export function CaravanExperience() {
  const [isPending, setIsPending] = useState(false);
  const [mode, setMode] = useState<"fixture" | "live">("fixture");
  const [run, setRun] = useState<CaravanRun>(() =>
    buildCaravanRun(fixtureMarket, proofTx, initialTimestamp),
  );

  function replayFixture() {
    setMode("fixture");
    setRun(buildCaravanRun(fixtureMarket, proofTx));
  }

  function runLiveFrame() {
    setIsPending(true);
    void fetchBrowserMarketFrame()
      .then((market) => {
        setMode("live");
        setRun(buildCaravanRun(market, proofTx));
      })
      .catch(() => {
        setMode("fixture");
        setRun(buildCaravanRun(fixtureMarket, proofTx));
      })
      .finally(() => setIsPending(false));
  }

  const decisionTone = run.decision.decision === "refuse" ? "red" : "green";
  const proofLabel = proofTx ? "Arc tx confirmed" : "Arc tx not configured";

  return (
    <main className="min-h-screen">
      <CaravanNav proofLabel={proofLabel} />
      <section className="relative min-h-screen px-4 pb-8 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-[1520px] gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <HeroPanel
            run={run}
            isPending={isPending}
            mode={mode}
            onLive={runLiveFrame}
            onReplay={replayFixture}
          />
          <SignalRoom run={run} decisionTone={decisionTone} />
        </div>
      </section>
      <WalletAuthPanel hasTxProof={Boolean(run.sale.txHash)} />
      <ProofSections run={run} />
    </main>
  );
}
