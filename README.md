# AgentTreasury App

> A static treasury dashboard UI for managing agent spending controls, built with Next.js.

## Overview

AgentTreasury App is a single-page web interface that demonstrates a treasury control panel for autonomous agents. It presents asset allocations, a spend-approval queue, signer health, and spending policies in a clean dashboard layout. All data shown is hardcoded demo data — the app is a front-end prototype with no backend, wallet connection, or on-chain integration. It is intended as a UI reference / design mockup.

## Features

- Treasury overview with summary metrics (total assets, runway, queued approvals, active policies).
- Asset allocation table with client-side filtering by asset type (all / stable / native).
- Spend queue showing pending requests, with a working "Export CSV" download generated in the browser.
- Spend-proposal form that prepends new entries to the in-memory queue (state is not persisted).
- Policies view with an adjustable daily-limit slider and a token allowlist toggle list.
- "Copy vault" button that writes a sample vault address to the clipboard.

Note: balances, agents, signer status, and the vault address are static placeholder values. There is no authentication, no API, and no blockchain connectivity. State resets on page reload.

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Plain CSS (`app/globals.css`)

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm (a `package-lock.json` is committed)

### Installation

```bash
npm install
```

### Configuration

No environment variables are required. The project does not read any configuration from the environment.

### Running

```bash
# Start the development server (http://localhost:3000)
npm run dev

# Create a production build
npm run build

# Serve the production build
npm run start
```

## Usage

The dashboard is a single page (`app/page.tsx`) with three tabs:

- **Overview** — asset allocation table (filterable) and the spend queue (with CSV export).
- **Approvals** — a form to queue a new spend proposal and a signer-health panel.
- **Policies** — daily spend-limit slider, token allowlist, and the approval-rule summary.

All interactions are client-side; submitted proposals live only in component state for the current session.

## Project structure

```
app/
  layout.tsx      # Root layout and page metadata
  page.tsx        # The dashboard (all UI and demo data)
  globals.css     # Styling
public/
  kite-logo-mark-black.png
```

## Status

Prototype / static demo. The UI is functional, but every value is hardcoded placeholder data and no backend, wallet, or chain integration exists. Not intended for production use as-is.

## License

No license specified.
