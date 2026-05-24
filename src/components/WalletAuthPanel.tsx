"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ShieldAlert, Wallet, X } from "lucide-react";
import {
  ARC_CHAIN_ID_HEX,
  buildSignMessage,
  clearWalletSession,
  getWalletProvider,
  readWalletSession,
  truncateAddress,
  writeWalletSession,
  type WalletSession,
} from "@/src/lib/wallet-auth";
import { ARC_TESTNET } from "@/src/lib/caravan";

type WalletStatus = "checking" | "ready" | "connected" | "blocked" | "error";

const chainLogo =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png";

function getInitialWalletView(): {
  status: WalletStatus;
  session: WalletSession | null;
  message: string;
} {
  const restored = readWalletSession();
  if (restored) {
    return {
      status: "connected",
      session: restored,
      message: "Signed wallet session restored from this browser tab.",
    };
  }
  if (getWalletProvider()) {
    return {
      status: "ready",
      session: null,
      message: "Wallet provider detected. Connect, verify Arc Testnet, and sign.",
    };
  }
  return {
    status: "blocked",
    session: null,
    message:
      "No EIP-1193 wallet provider was detected in this browser. Install or unlock a wallet to verify auth.",
  };
}

export function WalletAuthPanel({ hasTxProof }: { hasTxProof: boolean }) {
  const [status, setStatus] = useState<WalletStatus>("blocked");
  const [session, setSession] = useState<WalletSession | null>(null);
  const [message, setMessage] = useState(
    "No EIP-1193 wallet provider was detected in this browser. Install or unlock a wallet to verify auth.",
  );
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const initial = getInitialWalletView();
      if (initial.status !== status) {
        setStatus(initial.status);
        setSession(initial.session);
        setMessage(initial.message);
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [status]);

  const chainStatus = useMemo(() => {
    if (!session) return "not connected";
    return session.chainId.toLowerCase() === ARC_CHAIN_ID_HEX
      ? "Arc Testnet verified"
      : `wrong chain ${session.chainId}`;
  }, [session]);

  async function connectWallet() {
    const provider = getWalletProvider();
    if (!provider) {
      setStatus("blocked");
      setMessage("Wallet connect blocked: no EIP-1193 wallet provider found.");
      return;
    }

    setIsConnecting(true);
    setStatus("checking");
    setMessage("Requesting wallet account");

    try {
      const accounts = await provider.request<string[]>({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      if (!account) {
        throw new Error("Wallet returned no account.");
      }

      let chainId = await provider.request<string>({ method: "eth_chainId" });
      if (chainId.toLowerCase() !== ARC_CHAIN_ID_HEX) {
        setMessage("Requesting Arc Testnet network switch");
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARC_CHAIN_ID_HEX }],
        });
        chainId = await provider.request<string>({ method: "eth_chainId" });
      }

      if (chainId.toLowerCase() !== ARC_CHAIN_ID_HEX) {
        setStatus("blocked");
        setMessage(
          `Wallet stayed on ${chainId}; Arc Testnet ${ARC_CHAIN_ID_HEX} is required.`,
        );
        return;
      }

      const signedAt = new Date().toISOString();
      const signMessage = buildSignMessage(account, signedAt);
      const signature = await provider.request<string>({
        method: "personal_sign",
        params: [signMessage, account],
      });
      const nextSession = {
        account,
        chainId,
        signature,
        message: signMessage,
        signedAt,
      };
      writeWalletSession(nextSession);
      setSession(nextSession);
      setStatus("connected");
      setMessage("Wallet account signed a CARAVAN session on Arc Testnet.");
    } catch (error) {
      setStatus("error");
      setMessage((error as Error).message || "Wallet connection failed.");
    } finally {
      setIsConnecting(false);
    }
  }

  function disconnect() {
    clearWalletSession();
    setSession(null);
    setStatus(getWalletProvider() ? "ready" : "blocked");
    setMessage("Wallet session cleared from this browser tab.");
  }

  const isConnected = status === "connected" && session;
  const blocked = status === "blocked" || status === "error";

  return (
    <section id="auth" className="px-4 pb-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1520px]">
        <div className="liquid-glass grid gap-5 rounded-[28px] p-5 sm:p-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="mono text-xs uppercase tracking-[0.22em] text-white/45">
              Web3 auth
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Wallet session must be real before Arc testing.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/58">
              CARAVAN uses the browser wallet directly. It never invents a
              connected address: no provider means blocked, wrong chain means
              blocked, and no Arc transaction hash means settlement proof is
              still blocked.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-black/24 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black">
                  {isConnected ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Wallet avatar"
                      className="h-11 w-11 rounded-full"
                      src={`https://api.dicebear.com/9.x/shapes/svg?seed=${session.account}`}
                    />
                  ) : (
                    <Wallet size={20} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/42">
                    Account
                  </p>
                  <p className="mono truncate text-sm text-white/78">
                    {isConnected
                      ? truncateAddress(session.account)
                      : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Arc native token" className="h-5 w-5" src={chainLogo} />
                <span className="mono text-xs text-white/70">
                  {isConnected ? chainStatus : `Arc ${ARC_TESTNET.chainId}`}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <ProofPill
                label="Provider"
                ok={status === "ready" || status === "connected"}
                text={
                  status === "blocked"
                    ? "missing wallet"
                    : status === "checking"
                      ? "checking"
                      : "detected"
                }
              />
              <ProofPill
                label="Signature"
                ok={Boolean(session?.signature)}
                text={session?.signature ? "signed" : "not signed"}
              />
              <ProofPill
                label="Tx proof"
                ok={hasTxProof}
                text={hasTxProof ? "configured" : "blocked"}
              />
            </div>

            <div
              className={`rounded-3xl border p-4 ${
                blocked
                  ? "border-[rgba(255,108,108,0.32)] bg-[rgba(255,108,108,0.08)]"
                  : "border-white/10 bg-white/[0.035]"
              }`}
            >
              <div className="flex items-start gap-3">
                {blocked ? (
                  <ShieldAlert className="mt-1 text-[var(--red)]" size={18} />
                ) : (
                  <Check className="mt-1 text-[var(--green)]" size={18} />
                )}
                <p className="text-sm leading-6 text-white/66">{message}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {isConnected ? (
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  onClick={disconnect}
                  type="button"
                >
                  Disconnect <X size={16} />
                </button>
              ) : (
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isConnecting || status === "checking"}
                  onClick={connectWallet}
                  type="button"
                >
                  {isConnecting ? "Connecting wallet" : "Connect wallet"}
                  <Wallet size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofPill({
  label,
  ok,
  text,
}: {
  label: string;
  ok: boolean;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
      <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/42">
        {label}
      </p>
      <p
        className={`mt-2 text-sm font-semibold ${
          ok ? "text-[var(--green)]" : "text-[var(--amber)]"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
