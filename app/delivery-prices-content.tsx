"use client";

import { Plus, Save, Wand2 } from "lucide-react";
import { useState } from "react";

const iraqiProvinces = [
  "Baghdad",
  "Basra",
  "Erbil",
  "Mosul",
  "Najaf",
  "Karbala",
  "Sulaymaniyah",
  "Duhok",
  "Kirkuk",
  "Anbar",
  "Diyala",
  "Babil",
  "Wasit",
  "Maysan",
  "Dhi Qar",
  "Muthanna",
  "Qadisiyyah",
  "Salah ad-Din",
  "Halabja",
];

type Row = {
  province: string;
  small: number;
  large: number;
  free: boolean;
};

const initial: Row[] = iraqiProvinces.map((province) => ({
  province,
  small: 3000,
  large: 7000,
  free: false,
}));

export function DeliveryPricesContent() {
  const [rows, setRows] = useState<Row[]>(initial);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkSmall, setBulkSmall] = useState(0);
  const [bulkLarge, setBulkLarge] = useState(0);
  const [showBulk, setShowBulk] = useState(false);

  const update = (province: string, patch: Partial<Row>) =>
    setRows((all) =>
      all.map((r) => (r.province === province ? { ...r, ...patch } : r)),
    );

  const toggleSelect = (province: string) =>
    setSelected((all) =>
      all.includes(province)
        ? all.filter((p) => p !== province)
        : [...all, province],
    );

  const applyBulk = () => {
    setRows((all) =>
      all.map((r) =>
        selected.includes(r.province)
          ? { ...r, small: bulkSmall, large: bulkLarge }
          : r,
      ),
    );
    setShowBulk(false);
    setSelected([]);
  };

  const addProvince = () => {
    const name = prompt("New province name");
    if (!name) return;
    setRows((all) => [...all, { province: name, small: 0, large: 0, free: false }]);
  };

  return (
    <div className="delivery-prices-content">
      <h1>Seller Delivery Prices</h1>
      <p className="dashboard-sub">
        Set delivery prices per province for small and large products. Toggle
        free delivery where applicable.
      </p>

      <section className="delivery-prices-card">
        <div className="discount-plans-toolbar">
          <button
            className="discount-create-button"
            type="button"
            onClick={() => setShowBulk((v) => !v)}
            disabled={selected.length === 0}
          >
            <Wand2 aria-hidden="true" size={16} strokeWidth={2.4} />
            <span>Bulk Update ({selected.length})</span>
          </button>
          <button
            className="discount-create-button"
            type="button"
            onClick={addProvince}
          >
            <Plus aria-hidden="true" size={16} strokeWidth={2.4} />
            <span>Add Province</span>
          </button>
        </div>

        {showBulk ? (
          <div className="bulk-update-row">
            <label>
              <span>Small (IQD)</span>
              <input
                type="number"
                value={bulkSmall}
                onChange={(e) => setBulkSmall(Number(e.target.value))}
              />
            </label>
            <label>
              <span>Large (IQD)</span>
              <input
                type="number"
                value={bulkLarge}
                onChange={(e) => setBulkLarge(Number(e.target.value))}
              />
            </label>
            <button
              className="modal-primary"
              type="button"
              onClick={applyBulk}
            >
              Apply to {selected.length}
            </button>
          </div>
        ) : null}

        <div className="purchase-order-table-wrap">
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th />
                <th>Province</th>
                <th>Small (IQD)</th>
                <th>Large (IQD)</th>
                <th>Free Delivery</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.province} className="product-list-data-row">
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(row.province)}
                      onChange={() => toggleSelect(row.province)}
                      aria-label={`Select ${row.province}`}
                    />
                  </td>
                  <td>{row.province}</td>
                  <td>
                    <input
                      className="edit-table-input"
                      type="number"
                      value={row.small}
                      onChange={(e) =>
                        update(row.province, { small: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="edit-table-input"
                      type="number"
                      value={row.large}
                      onChange={(e) =>
                        update(row.province, { large: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="modal-toggle"
                      type="button"
                      onClick={() => update(row.province, { free: !row.free })}
                      aria-pressed={row.free}
                    >
                      <span
                        className={`toggle-switch${row.free ? " is-enabled" : ""}`}
                      />
                      <strong>{row.free ? "Free" : "Paid"}</strong>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="delivery-save-row">
          <button className="save-warranty-button" type="button">
            <Save aria-hidden="true" size={18} strokeWidth={2.4} />
            <span>Save All Changes</span>
          </button>
        </div>
      </section>
    </div>
  );
}
