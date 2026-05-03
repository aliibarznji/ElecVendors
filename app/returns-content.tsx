import { ChevronLeft, ChevronRight } from "lucide-react";

const returnColumns = [
  "Transaction",
  "Total",
  "Transaction Date",
  "Status",
  "Receipt",
  "Details",
];

export function ReturnsContent() {
  return (
    <div className="returns-content">
      <h1>Returns</h1>

      <section className="returns-card" aria-label="Returns transaction">
        <p className="returns-copy">
          The below table shows your returns transaction.
        </p>

        <div className="returns-filter-stack">
          <label className="returns-filter">
            <span>Date:</span>
            <input placeholder="Date Filter" />
          </label>
          <button className="returns-reset" type="button">
            Reset Filter
          </button>
        </div>

        <div className="returns-table-wrap">
          <table className="returns-table">
            <thead>
              <tr>
                {returnColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="returns-empty-row">
                <td colSpan={returnColumns.length} />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="returns-pagination" aria-label="Returns pagination">
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
