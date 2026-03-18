import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadInvoice } from "../api/client";

export default function UploadZone({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadInvoice(file, setProgress);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onUploadSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Check the file type.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [], "image/png": [], "image/jpeg": [] },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? "#3b82f6" : success ? "#16a34a" : "#d1d5db"}`,
        borderRadius: 12,
        padding: "2.5rem",
        textAlign: "center",
        cursor: "pointer",
        background: isDragActive ? "#eff6ff" : success ? "#f0fdf4" : "#ffffff",
        transition: "all 0.2s"
      }}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div>
          <p style={{ color: "#6b7280", marginBottom: 10 }}>
            Uploading... {progress}%
          </p>
          <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8 }}>
            <div style={{
              background: "#3b82f6",
              width: `${progress}%`,
              height: 8,
              borderRadius: 4,
              transition: "width 0.2s"
            }} />
          </div>
        </div>
      ) : success ? (
        <div>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
          <p style={{ color: "#16a34a", fontWeight: 500 }}>
            Upload successful — processing started
          </p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 40, marginBottom: 12, color: "#9ca3af" }}>📄</div>
          <p style={{ color: "#374151", fontWeight: 500 }}>
            {isDragActive ? "Drop the invoice here" : "Drag and drop an invoice here"}
          </p>
          <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 6 }}>
            or click to browse — PDF, PNG, or JPG accepted
          </p>
        </div>
      )}

      {error && (
        <p style={{ color: "#dc2626", marginTop: 12, fontSize: 13 }}>{error}</p>
      )}
    </div>
  );
}