import { ChevronLeft, ChevronRight } from "lucide-react";

const statementColumns = [
  "Date",
  "Type",
  "Transaction Number",
  "Payment Method",
  "Amount",
];

function StatementSummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "green" | "blue";
}) {
  return (
    <article className={`statement-summary-card statement-summary-${accent}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

export function AccountStatementContent() {
  return (
    <div className="account-statement-content">
      <h1>Account Statement</h1>

      <section className="statement-summary-grid" aria-label="Account totals">
        <StatementSummaryCard label="Balance" value="$ 0.00" accent="green" />
        <StatementSummaryCard
          label="Total Amount"
          value="$ 0.00"
          accent="blue"
        />
      </section>

      <section className="account-statement-card" aria-label="Account statement table">
        <div className="statement-topline">
          <p>The below table shows your Payments.</p>
          <button className="statement-reset" type="button">
            Reset Filters
          </button>
        </div>

        <div className="statement-filter-row">
          <input
            className="statement-date-filter"
            placeholder="Date Filter"
            aria-label="Date filter"
          />

          <label className="statement-search">
            <span>Search:</span>
            <input aria-label="Search account statement" />
          </label>
        </div>

        <div className="statement-table-wrap">
          <table className="statement-table">
            <thead>
              <tr>
                {statementColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="statement-empty-row">
                <td colSpan={statementColumns.length} />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="statement-pagination" aria-label="Account statement pagination">
          <span>Items per page 20</span>
          <span>0 of 0</span>
          <button type="button" aria-label="Previous page" disabled>
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
          <button type="button" aria-label="Next page" disabled>
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.1} />
          </button>
        </div>
      </section>
    </div>
  );
}
