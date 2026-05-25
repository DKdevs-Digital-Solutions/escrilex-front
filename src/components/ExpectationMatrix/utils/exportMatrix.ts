// utils/exportMatrix.ts
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function getColumnLabel(column: any) {
  return column.key === "status" ? "Situação" : column.label;
}

function getCellValue(item: any, column: any, users: any[]) {
  const value = item[column.key];

  if (column.type === "user") {
    const user = users.find((u: any) => u.id === value);
    return user?.name || "";
  }

  if (column.type === "date") {
    return value ? new Date(value).toLocaleDateString("pt-BR") : "";
  }

  if (column.key === "active") {
    return value ? "Ativo" : "Inativo";
  }

  return value ?? "";
}

export function exportMatrixToExcel(items: any[], columns: any[], users: any[]) {
  const rows = items.map((item) => {
    const row: Record<string, any> = {};

    columns.forEach((column) => {
      row[getColumnLabel(column)] = getCellValue(item, column, users);
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Matriz");

  XLSX.writeFile(workbook, "matriz-expectativas.xlsx");
}

export function exportMatrixToPDF(items: any[], columns: any[], users: any[]) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const head = [columns.map((column) => getColumnLabel(column))];

  const body = items.map((item) =>
    columns.map((column) => String(getCellValue(item, column, users)))
  );

  doc.setFontSize(14);
  doc.text("Matriz de Expectativas", 40, 35);

  autoTable(doc, {
    head,
    body,
    startY: 55,
    styles: {
      fontSize: 8,
      cellPadding: 5,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: {
      left: 30,
      right: 30,
    },
  });

  doc.save("matriz-expectativas.pdf");
}