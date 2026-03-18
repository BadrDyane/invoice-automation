import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const uploadInvoice = (file, onProgress) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/upload", form, {
    onUploadProgress: (e) => onProgress(Math.round((e.loaded / e.total) * 100))
  });
};

export const fetchInvoices = (params = {}) => api.get("/invoices", { params });
export const fetchInvoice = (id) => api.get(`/invoices/${id}`);
export const fetchStats = () => api.get("/stats");
export const exportCSV = () => api.get("/export/csv", { responseType: "blob" });