export default function FilterBar({ search, setSearch, status, setStatus, onExport }) {
  return (
    <div style={{
      display: "flex",
      gap: 12,
      marginBottom: 16,
      flexWrap: "wrap",
      alignItems: "center"
    }}>
      {/* Search input */}
      <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
        <span style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9ca3af",
          fontSize: 14
        }}>
          🔍
        </span>
        <input
          placeholder="Search by vendor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 12px 9px 36px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            background: "#fff",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        style={{
          padding: "9px 12px",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          fontSize: 14,
          background: "#fff",
          cursor: "pointer",
          outline: "none"
        }}
      >
        <option value="">All statuses</option>
        <option value="uploaded">Uploaded</option>
        <option value="processing">Processing</option>
        <option value="processed">Processed</option>
        <option value="failed">Failed</option>
      </select>

      {/* Export button */}
      <button
        onClick={onExport}
        style={{
          background: "#16a34a",
          color: "#fff",
          padding: "9px 18px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          whiteSpace: "nowrap"
        }}
        onMouseEnter={e => e.target.style.background = "#15803d"}
        onMouseLeave={e => e.target.style.background = "#16a34a"}
      >
        Export CSV
      </button>
    </div>
  );
}