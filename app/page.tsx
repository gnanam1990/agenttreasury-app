"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";

const VAULT = "0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043";

const assets = [
  { kind: "native", asset: "KITE", balance: "18,420.00", value: "$73,680", share: "59%" },
  { kind: "stable", asset: "USDC.e", balance: "32,800.00", value: "$32,800", share: "26%" },
  { kind: "stable", asset: "Test USDT", balance: "18,340.00", value: "$18,340", share: "15%" },
];

type QueueRow = {
  agent: string;
  request: string;
  amount: string;
  status: "ready" | "review";
};

const initialQueue: QueueRow[] = [
  { agent: "docs-agent", request: "Index docs update", amount: "42 USDC.e", status: "ready" },
  { agent: "market-agent", request: "API listing refresh", amount: "16 USDC.e", status: "review" },
  { agent: "pay-agent", request: "Payment link audit", amount: "8 KITE", status: "ready" },
];

export default function HomePage() {
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [queue, setQueue] = useState(initialQueue);
  const [dailyLimit, setDailyLimit] = useState(1200);
  const [copyState, setCopyState] = useState("Copy vault");

  const filteredAssets = useMemo(
    () => assets.filter((asset) => filter === "all" || asset.kind === filter),
    [filter]
  );

  async function copyVault() {
    try {
      await navigator.clipboard.writeText(VAULT);
      setCopyState("Copied");
    } catch {
      setCopyState("Copy failed");
    }
    window.setTimeout(() => setCopyState("Copy vault"), 1300);
  }

  function queueProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setQueue((current) => [
      {
        agent: String(data.get("agent")),
        request: String(data.get("request")),
        amount: String(data.get("amount")),
        status: "review",
      },
      ...current,
    ]);
    event.currentTarget.reset();
    setTab("overview");
  }

  function exportCsv() {
    const rows = queue.map((row) => [row.agent, row.request, row.amount, row.status]);
    const csv = ["Agent,Request,Amount,Status", ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "agenttreasury-queue.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#" aria-label="AgentTreasury home">
          <span className="brand-mark" aria-hidden="true">
            <Image
              src="/kite-logo-mark-black.png"
              alt=""
              width={32}
              height={32}
              priority
            />
          </span>
          <span>AgentTreasury</span>
        </a>
        <nav className="header-actions" aria-label="Primary">
          <button className="text-button" type="button" onClick={copyVault}>
            {copyState}
          </button>
          <button className="primary-button" type="button" onClick={() => setTab("approvals")}>
            New proposal
          </button>
        </nav>
      </header>

      <main>
        <section className="workspace-head">
          <div>
            <p className="eyebrow">Kite Mainnet treasury</p>
            <h1>Agent operating vault</h1>
            <p className="vault-address">{VAULT}</p>
          </div>
          <div className="status-strip" aria-label="Treasury status">
            <span>Policy guard: on</span>
            <span>Signer threshold: 2 of 3</span>
            <span>Last sync: 2 min ago</span>
          </div>
        </section>

        <section className="metric-grid" aria-label="Treasury metrics">
          <Metric label="Total assets" value="$124,820" detail="KITE, USDC.e, Test USDT" />
          <Metric label="Runway" value="84 days" detail="Based on 30 day spend" />
          <Metric label="Queued approvals" value={String(queue.length)} detail="1 over policy limit" />
          <Metric label="Active policies" value="5" detail="Daily, per-agent, token limits" />
        </section>

        <div className="tabs" role="tablist" aria-label="Treasury views">
          {["overview", "approvals", "policies"].map((id) => (
            <button
              key={id}
              className={`tab ${tab === id ? "is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
            >
              {id[0].toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <section className="tab-panel is-active">
            <div className="dashboard-grid">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Asset allocation</h2>
                    <p>Current balances grouped by token.</p>
                  </div>
                  <select
                    aria-label="Filter assets"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  >
                    <option value="all">All assets</option>
                    <option value="stable">Stable assets</option>
                    <option value="native">Native assets</option>
                  </select>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Balance</th>
                        <th>Value</th>
                        <th>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr key={asset.asset}>
                          <td>{asset.asset}</td>
                          <td>{asset.balance}</td>
                          <td>{asset.value}</td>
                          <td>{asset.share}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Spend queue</h2>
                    <p>Pending requests waiting for signer action.</p>
                  </div>
                  <button className="ghost-button" type="button" onClick={exportCsv}>
                    Export CSV
                  </button>
                </div>
                <QueueTable queue={queue} />
              </section>
            </div>
          </section>
        )}

        {tab === "approvals" && (
          <section className="tab-panel is-active">
            <div className="split-grid">
              <form className="panel proposal-form" onSubmit={queueProposal}>
                <h2>Create spend proposal</h2>
                <label>
                  Agent
                  <input name="agent" placeholder="agent-name" required />
                </label>
                <label>
                  Request
                  <input name="request" placeholder="Purpose" required />
                </label>
                <label>
                  Amount
                  <input name="amount" placeholder="25 USDC.e" required />
                </label>
                <button className="primary-button" type="submit">
                  Queue proposal
                </button>
              </form>

              <section className="panel">
                <h2>Signer health</h2>
                <div className="signer-list">
                  <div>
                    <span>Owner</span>
                    <strong>online</strong>
                  </div>
                  <div>
                    <span>Operations</span>
                    <strong>online</strong>
                  </div>
                  <div>
                    <span>Recovery</span>
                    <strong>standby</strong>
                  </div>
                </div>
              </section>
            </div>
          </section>
        )}

        {tab === "policies" && (
          <section className="tab-panel is-active">
            <div className="policy-grid">
              <section className="panel">
                <h2>Daily spend limit</h2>
                <div className="slider-row">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    value={dailyLimit}
                    onChange={(event) => setDailyLimit(Number(event.target.value))}
                  />
                  <strong>{dailyLimit} USDC.e</strong>
                </div>
              </section>
              <section className="panel">
                <h2>Token allowlist</h2>
                <label className="toggle-line">
                  <input type="checkbox" defaultChecked />
                  KITE
                </label>
                <label className="toggle-line">
                  <input type="checkbox" defaultChecked />
                  USDC.e
                </label>
                <label className="toggle-line">
                  <input type="checkbox" defaultChecked />
                  Test USDT
                </label>
              </section>
              <section className="panel">
                <h2>Approval rule</h2>
                <p className="policy-copy">
                  Requests over 100 USDC.e require two signers before execution.
                </p>
              </section>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function QueueTable({ queue }: { queue: QueueRow[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Request</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((row, index) => (
            <tr key={`${row.agent}-${row.request}-${index}`}>
              <td>{row.agent}</td>
              <td>{row.request}</td>
              <td>{row.amount}</td>
              <td>
                <span className={`badge ${row.status === "review" ? "warn" : ""}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
