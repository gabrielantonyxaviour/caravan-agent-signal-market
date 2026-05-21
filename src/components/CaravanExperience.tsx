"use client";

import { useState, useTransition } from "react";
import {
  CaravanRun,
  buildCaravanRun,
  fetchMarketFrame,
  fixtureMarket,
} from "@/src/lib/caravan";
import { CaravanNav } from "@/src/components/CaravanNav";
import { HeroPanel } from "@/src/components/HeroPanel";
import { ProofSections } from "@/src/components/ProofSections";
import { SignalRoom } from "@/src/components/SignalRoom";

const proofTx = process.env.NEXT_PUBLIC_ARC_TX_HASH;
const initialTimestamp = "2026-05-21T00:00:00.000Z";

export function CaravanExperience() {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"fixture" | "live">("fixture");
  const [run, setRun] = useState<CaravanRun>(() =>
    buildCaravanRun(fixtureMarket, proofTx, initialTimestamp),
  );

  function replayFixture() {
    setMode("fixture");
    setRun(buildCaravanRun(fixtureMarket, proofTx));
  }

  function runLiveFrame() {
    startTransition(async () => {
      try {
        const market = await fetchMarketFrame();
        setMode("live");
        setRun(buildCaravanRun(market, proofTx));
      } catch {
        setMode("fixture");
        setRun(buildCaravanRun(fixtureMarket, proofTx));
      }
    });
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
      <ProofSections run={run} />
    </main>
  );
}
