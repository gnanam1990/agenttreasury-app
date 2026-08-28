# AgentTreasury App

Treasury interface for AI agents on Kite Mainnet — the operator's view of a
shared vault that autonomous agents spend from under policy.

> **Prototype.** This is a front-end prototype. Balances, the spend queue, and
> signer health are in-memory fixtures in `app/page.tsx`; nothing is read from
> or written to chain yet. The vault address is displayed for reference only.

## What it shows

Three tabs over one agent-operating vault:

**Overview** — asset allocation across KITE, USDC.e and Test USDT, filterable by
native vs. stablecoin, alongside the live spend queue with each agent's pending
request and its `ready` / `review` status.

**Approvals** — a spend-proposal form, plus signer health for the vault's
approvers.

**Policies** — the daily spend limit (adjustable), the token allowlist, and the
approval rule that decides which requests clear automatically and which get held
for review.

## Running locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Production build:

```bash
npm run build && npm start
```

## Stack

- **Next.js 16** with the App Router, React 19, TypeScript
- No component library — the "warm Kite" visual system lives in
  `app/globals.css` as plain CSS
- No backend, no wallet connection, no RPC calls

## Layout

```text
app/
  page.tsx      dashboard, approvals, and policy views (all client-side state)
  layout.tsx    root layout and metadata
  globals.css   warm Kite visual system
public/
  kite-logo-mark-black.png
```

## Deployment

- **Production:** https://agenttreasury-app.vercel.app
- **Host:** Vercel (`agenttreasury-app`)

## Wiring it to chain

The fixtures are deliberately shaped like the eventual API responses, so the
path to a real integration is narrow:

1. Replace the `assets` array with a balance read for `VAULT` across the
   allowlisted tokens.
2. Replace `initialQueue` with pending proposals from the treasury contract.
3. Make `dailyLimit` a policy read/write instead of local state.

## License

MIT
