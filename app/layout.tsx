import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentTreasury",
  description: "Treasury controls for AI agents on Kite Mainnet.",
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
