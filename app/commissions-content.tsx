export function CommissionsContent() {
  return (
    <div className="commissions-content">
      <h1>Commissions</h1>

      <section className="commissions-card" aria-label="Commissions table">
        <div className="commissions-toolbar">
          <p>
            The below table shows commissions charged by Electromall for each
            product category. Commission is deducted automatically from the
            vendor&apos;s account upon payment.
          </p>

          <label className="commission-search">
            <span>Search:</span>
            <input type="search" aria-label="Search commissions" />
          </label>
        </div>

        <div className="commissions-table-wrap">
          <table className="commissions-table">
            <thead>
              <tr>
                <th scope="col">Product Category</th>
                <th scope="col">Marketplace Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr className="commission-empty-row">
                <td colSpan={2}>No commission data found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
