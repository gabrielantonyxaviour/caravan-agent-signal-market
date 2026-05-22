import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CARAVAN | Agent-to-Agent Signal Market",
  description:
    "Agents price, audit, and refuse stale market signals with an Arc-ready USDC settlement path.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
