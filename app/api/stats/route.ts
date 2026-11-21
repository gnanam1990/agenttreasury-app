// Read-only stats for external dashboards.
//
// The app has no live treasury data yet: balances, the spend queue and signer
// health in app/page.tsx are in-memory fixtures, and the displayed vault
// address (0xe1844c5D63a9...) is a LayerZero ReceiveUln302 message library on
// Kite Mainnet, not a treasury contract. Rather than echo fixture numbers, this
// route reports that no live source exists. Once balances are read from chain
// (see "Wiring it to chain" in the README), return
// { aum, treasuries, source, as_of } here instead.

const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

export function GET() {
  return Response.json(
    {
      error: "no live data source",
      reason:
        "AgentTreasury is a front-end prototype: treasury balances are fixtures in app/page.tsx, no treasury contract or backend is wired, and the displayed vault address is a LayerZero ReceiveUln302 contract on Kite Mainnet, not a treasury.",
    },
    { status: 503, headers: { "Cache-Control": CACHE_CONTROL } }
  );
}
