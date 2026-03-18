export default function StatsCards({ stats }) {
  const cards = [
    {
      label: "Total Invoices",
      value: stats.total_invoices ?? 0,
      icon: "📄",
      color: "#3b82f6"
    },
    {
      label: "Processed",
      value: stats.processed ?? 0,
      icon: "✅",
      color: "#16a34a"
    },
    {
      label: "Failed",
      value: stats.failed ?? 0,
      icon: "❌",
      color: "#dc2626"
    },
    {
      label: "Total Value",
      value: `$${(stats.total_value ?? 0).toLocaleString()}`,
      icon: "💰",
      color: "#7c3aed"
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: 16,
      margin: "24px 0"
    }}>
      {cards.map(({ label, value, icon, color }) => (
        <div key={label} style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "20px 24px",
          borderTop: `3px solid ${color}`
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "#111827" }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}