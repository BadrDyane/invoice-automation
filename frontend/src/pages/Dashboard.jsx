import { useEffect, useState } from "react";
import { fetchInvoices, fetchStats, exportCSV } from "../api/client";
import UploadZone from "../components/UploadZone";
import InvoiceTable from "../components/InvoiceTable";
import StatsCards from "../components/StatsCards";
import VendorChart from "../components/VendorChart";
import FilterBar from "../components/FilterBar";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    try {
      const params = {};
      if (search) params.vendor = search;
      if (status) params.status = status;

      const [invRes, statsRes] = await Promise.all([
        fetchInvoices(params),
        fetchStats()
      ]);

      setInvoices(invRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reload when search or status filter changes
  useEffect(() => {
    load();
  }, [search, status]);

  const handleUploadSuccess = () => {
    setTimeout(load, 5000);
  };

  const handleExport = async () => {
    try {
      const res = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "invoices.csv");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
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

      {/* Stats cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Vendor chart — only show if there's data */}
      {stats?.by_vendor?.length > 0 && (
        <VendorChart data={stats.by_vendor} />
      )}

      {/* Invoice list */}
      <div style={{
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
            {invoices.length} result{invoices.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Search, filter and export controls */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <FilterBar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            onExport={handleExport}
          />
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