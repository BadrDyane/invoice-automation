import { useEffect, useState } from "react";
import { fetchInvoices } from "../api/client";
import UploadZone from "../components/UploadZone";
import InvoiceTable from "../components/InvoiceTable";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetchInvoices();
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // After upload, wait 5 seconds then refresh
  const handleUploadSuccess = () => {
    setTimeout(load, 5000);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
          Invoice Dashboard
        </h1>
        <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>
          Upload invoices and let AI extract the data automatically
        </p>
      </div>

      {/* Upload zone */}
      <UploadZone onUploadSuccess={handleUploadSuccess} />

      {/* Invoice list */}
      <div style={{
        marginTop: 32,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden"
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
            Invoices
          </h2>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            {invoices.length} total
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>
            Loading...
          </div>
        ) : (
          <InvoiceTable invoices={invoices} />
        )}
      </div>
    </div>
  );
}