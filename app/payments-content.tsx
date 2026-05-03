import { ChevronLeft, ChevronRight } from "lucide-react";

const paymentColumns = [
  "Date",
  "Amount",
  "Payment Method",
  "Payment Reference",
];

export function PaymentsContent() {
  return (
    <div className="payments-content">
      <h1>Payments</h1>

      <section className="payments-card" aria-label="Payments table">
        <div className="payments-topline">
          <p>The below table shows your Payments.</p>
          <button className="payments-reset" type="button">
            Reset Filters
          </button>
        </div>

        <input
          className="payments-date-filter"
          placeholder="Date Filter"
          aria-label="Date filter"
        />

        <div className="payments-table-wrap">
          <table className="payments-table">
            <thead>
              <tr>
                {paymentColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="payments-empty-row">
                <td colSpan={paymentColumns.length} />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="payments-pagination" aria-label="Payments pagination">
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
