"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

type Pending = {
  id: string;
  name: string;
  sku: string;
  vendor: string;
  uploaded: string;
  daysInQueue: number;
};

const initial: Pending[] = [
  {
    id: "p1",
    name: "Sheglam Lipstick Matte Red",
    sku: "sg-lip-22-rd",
    vendor: "Sheglam Iraq",
    uploaded: "2026-04-29",
    daysInQueue: 5,
  },
  {
    id: "p2",
    name: "Electromall Hair Dryer 2000W",
    sku: "em-dry-90-bk",
    vendor: "Electromall Direct",
    uploaded: "2026-05-01",
    daysInQueue: 3,
  },
  {
    id: "p3",
    name: "Braun Series 7 Shaver",
    sku: "br-shav-77-sl",
    vendor: "Braun Distributor",
    uploaded: "2026-05-03",
    daysInQueue: 1,
  },
];

export function AccountManagerPendingProductsContent() {
  const [list, setList] = useState(initial);
  const [rejecting, setRejecting] = useState<Pending | null>(null);
  const [reason, setReason] = useState("");

  return (
    <div className="account-manager-pending-content">
      <h1>Pending Products</h1>

      <section className="account-manager-card">
        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>Thumb</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Vendor</th>
                <th>Upload Date</th>
                <th>Days in Queue</th>
                <th>Approve</th>
                <th>Reject</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    No pending products
                  </td>
                </tr>
              ) : (
                list.map((p) => (
                  <tr key={p.id} className="product-list-data-row">
                    <td>
                      <div className="sample-product-thumb"><span /></div>
                    </td>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.vendor}</td>
                    <td>{p.uploaded}</td>
                    <td>{p.daysInQueue}</td>
                    <td>
                      <button
                        className="row-action-btn approve-btn"
                        type="button"
                        onClick={() =>
                          setList((all) => all.filter((x) => x.id !== p.id))
                        }
                      >
                        <Check
                          aria-hidden="true"
                          size={15}
                          strokeWidth={2.5}
                        />
                      </button>
                    </td>
                    <td>
                      <button
                        className="row-action-btn reject-btn"
                        type="button"
                        onClick={() => setRejecting(p)}
                      >
                        <X
                          aria-hidden="true"
                          size={15}
                          strokeWidth={2.5}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {rejecting ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <div>
                <h3>Reject Product</h3>
              </div>
              <button
                className="modal-close"
                type="button"
                onClick={() => setRejecting(null)}
              >
                <X aria-hidden="true" size={18} strokeWidth={2.4} />
              </button>
            </header>
            <div className="modal-body">
              <p className="modal-sub">{rejecting.name}</p>
              <label className="modal-field">
                <span>Reason</span>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
            </div>
            <footer className="modal-footer">
              <button
                className="modal-cancel"
                type="button"
                onClick={() => setRejecting(null)}
              >
                Cancel
              </button>
              <button
                className="modal-primary"
                type="button"
                onClick={() => {
                  setList((all) => all.filter((x) => x.id !== rejecting.id));
                  setRejecting(null);
                  setReason("");
                }}
              >
                Reject
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
