import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InvoiceDetail from "./pages/InvoiceDetail";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

        {/* Top navbar */}
        <nav style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 2rem",
          height: 56,
          display: "flex",
          alignItems: "center"
        }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>
            InvoiceAI
          </span>
        </nav>

        {/* Page content */}
        <div style={{ padding: "2rem 0" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoice/:id" element={<InvoiceDetail />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}