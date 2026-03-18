import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  uploaded:   { background: "#fef3c7", color: "#92400e" },
  processing: { background: "#dbeafe", color: "#1e40af" },
  processed:  { background: "#dcfce7", color: "#166534" },
  failed:     { background: "#fee2e2", color: "#991b1b" },
};

export default function InvoiceTable({ invoices }) {
  const navigate = useNavigate();

  if (invoices.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
        <p>No invoices yet. Upload one above to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
            {["ID", "Filename", "Vendor", "Invoice #", "Date", "Total", "Status"].map(h => (
              <th key={h} style={{
                textAlign: "left",
                padding: "10px 14px",
                color: "#6b7280",
                fontWeight: 500,
                whiteSpace: "nowrap"
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr
              key={inv.id}
              onClick={() => navigate(`/invoice/${inv.id}`)}
              style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <td style={{ padding: "12px 14px", color: "#6b7280" }}>#{inv.id}</td>
              <td style={{ padding: "12px 14px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {inv.original_filename}
              </td>
              <td style={{ padding: "12px 14px" }}>{inv.vendor_name || "—"}</td>
              <td style={{ padding: "12px 14px" }}>{inv.invoice_number || "—"}</td>
              <td style={{ padding: "12px 14px" }}>{inv.invoice_date || "—"}</td>
              <td style={{ padding: "12px 14px", fontWeight: 500 }}>
                {inv.total_amount
                  ? `${inv.currency || "USD"} ${inv.total_amount.toFixed(2)}`
                  : "—"}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <span style={{
                  ...STATUS_STYLES[inv.status],
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500
                }}>
                  {inv.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}