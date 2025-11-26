// components/ExportCSV.js
import React from "react";
import { Button } from "antd";

/**
 * data: array of objects (rows)
 * filename: string
 */
export default function ExportCSV({ data = [], filename = "export.csv" }) {
  const handleExport = () => {
    if (!data || !data.length) {
      alert("No data to export");
      return;
    }
    const header = Object.keys(data[0]);
    const csv = [
      header.join(","),
      ...data.map((row) => header.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleExport}>Export CSV</Button>;
}
