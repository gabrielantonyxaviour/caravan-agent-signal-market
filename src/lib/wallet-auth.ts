import { ARC_TESTNET } from "@/src/lib/caravan";

export const ARC_CHAIN_ID_HEX = `0x${ARC_TESTNET.chainId.toString(16)}`;
export const WALLET_SESSION_KEY = "caravan.wallet.session.v1";

export type WalletSession = {
  account: string;
  chainId: string;
  signature: string;
  message: string;
  signedAt: string;
};

export type EthereumProvider = {
  request: <T = unknown>(args: {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }) => Promise<T>;
};

export function getWalletProvider(): EthereumProvider | undefined {
  if (typeof window === "undefined") return undefined;
  const maybeWindow = window as typeof window & { ethereum?: EthereumProvider };
  return maybeWindow.ethereum;
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function buildSignMessage(account: string, generatedAt: string) {
  return [
    "CARAVAN agent-to-agent signal market",
    `Account: ${account}`,
    `Arc chain: ${ARC_TESTNET.chainId}`,
    `Session: ${generatedAt}`,
    "Purpose: verify operator intent for end-to-end test execution.",
  ].join("\n");
}

export function readWalletSession(): WalletSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(WALLET_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<WalletSession>;
    if (
      typeof parsed.account === "string" &&
      typeof parsed.chainId === "string" &&
      typeof parsed.signature === "string" &&
      typeof parsed.message === "string" &&
      typeof parsed.signedAt === "string"
    ) {
      return parsed as WalletSession;
    }
  } catch {
    window.sessionStorage.removeItem(WALLET_SESSION_KEY);
  }
  return null;
}

export function writeWalletSession(session: WalletSession) {
  window.sessionStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(session));
}

export function clearWalletSession() {
  window.sessionStorage.removeItem(WALLET_SESSION_KEY);
}
