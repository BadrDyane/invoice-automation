import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInvoice } from "../api/client";

const STATUS_STYLES = {
  uploaded:   { background: "#fef3c7", color: "#92400e" },
  processing: { background: "#dbeafe", color: "#1e40af" },
  processed:  { background: "#dcfce7", color: "#166534" },
  failed:     { background: "#fee2e2", color: "#991b1b" },
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice(id)
      .then(r => setInvoice(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ padding: "2rem", color: "#6b7280" }}>Loading invoice...</div>
  );

  if (!invoice) return (
    <div style={{ padding: "2rem", color: "#dc2626" }}>Invoice not found.</div>
  );

  const fields = [
    ["Vendor", invoice.vendor_name],
    ["Invoice #", invoice.invoice_number],
    ["Invoice Date", invoice.invoice_date],
    ["Due Date", invoice.due_date],
    ["Total", invoice.total_amount ? `${invoice.currency || "USD"} ${invoice.total_amount}` : null],
    ["Uploaded", new Date(invoice.upload_timestamp).toLocaleString()],
    ["Processed", invoice.processed_timestamp
      ? new Date(invoice.processed_timestamp).toLocaleString()
      : null],
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem" }}>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        style={{
          background: "none",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "6px 14px",
          cursor: "pointer",
          marginBottom: 24,
          color: "#374151",
          fontSize: 14
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>{invoice.original_filename}</h2>
        <span style={{
          ...STATUS_STYLES[invoice.status],
          padding: "3px 12px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 500
        }}>
          {invoice.status}
        </span>
      </div>

      {/* Fields grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 32
      }}>
        {fields.map(([label, value]) => (
          <div key={label} style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "14px 16px"
          }}>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {label}
            </div>
            <div style={{ fontWeight: 500, color: value ? "#111827" : "#d1d5db" }}>
              {value || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Line items */}
      {invoice.line_items?.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 12, fontWeight: 500 }}>Line Items</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                {["Description", "Quantity", "Unit Price", "Total"].map(h => (
                  <th key={h} style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    color: "#6b7280",
                    fontWeight: 500
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.line_items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 12px" }}>{item.description || "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{item.quantity ?? "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{item.unit_price ?? "—"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{item.total ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error message */}
      {invoice.error_message && (
        <div style={{
          marginTop: 24,
          padding: 16,
          background: "#fef2f2",
          borderRadius: 10,
          border: "1px solid #fecaca",
          color: "#dc2626",
          fontSize: 14
        }}>
          <strong>Error:</strong> {invoice.error_message}
        </div>
      )}
    </div>
  );
}