const tabs = document.querySelectorAll("[data-tab-target]");
const tabButtons = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const filter = document.querySelector("#asset-filter");
const assetRows = document.querySelectorAll("#asset-table tr");
const copyButtons = document.querySelectorAll("[data-copy]");
const proposalForm = document.querySelector("#proposal-form");
const queueTable = document.querySelector("#queue-table");
const approvalCount = document.querySelector("#approval-count");
const exportButton = document.querySelector("#export-csv");
const dailyLimit = document.querySelector("#daily-limit");
const dailyLimitValue = document.querySelector("#daily-limit-value");

function setTab(id) {
  tabButtons.forEach((button) => {
    const active = button.dataset.tabTarget === id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === id);
  });
}

tabs.forEach((button) => {
  button.addEventListener("click", () => {
    setTab(button.dataset.tabTarget);
  });
});

filter?.addEventListener("change", () => {
  assetRows.forEach((row) => {
    const show = filter.value === "all" || row.dataset.kind === filter.value;
    row.hidden = !show;
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1300);
    } catch {
      button.textContent = "Copy failed";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1300);
    }
  });
});

proposalForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(proposalForm);
  const row = document.createElement("tr");
  const status = document.createElement("span");
  status.className = "badge warn";
  status.textContent = "review";

  [data.get("agent"), data.get("request"), data.get("amount")].forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = String(value);
    row.appendChild(cell);
  });

  const statusCell = document.createElement("td");
  statusCell.appendChild(status);
  row.appendChild(statusCell);

  queueTable?.prepend(row);
  approvalCount.textContent = String(Number(approvalCount.textContent) + 1);
  proposalForm.reset();
  setTab("overview");
});

exportButton?.addEventListener("click", () => {
  const rows = Array.from(queueTable.querySelectorAll("tr")).map((row) =>
    Array.from(row.children).map((cell) => cell.textContent.trim())
  );
  const csv = ["Agent,Request,Amount,Status", ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "agenttreasury-queue.csv";
  anchor.click();
  URL.revokeObjectURL(url);
});

dailyLimit?.addEventListener("input", () => {
  dailyLimitValue.textContent = dailyLimit.value;
});
