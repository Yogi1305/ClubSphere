import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportParticipantsToExcel = (participants, eventName) => {
  console.log("Exporting participants:", participants);
  if (!participants || participants.length === 0) return;

  // ---- STEP 1: COLLECT ALL UNIQUE LABELS FROM UserId ----
  const labelSet = new Set();

  participants.forEach((p) => {
    if (p.formdata && typeof p.formdata === "object") {
      Object.keys(p.formdata).forEach((key) => labelSet.add(key));
    }
  });

  const labels = Array.from(labelSet);

  // ---- STEP 2: BUILD EXCEL DATA ----
  const excelData = participants.map((p, index) => {
    const row = { S_No: index + 1 };

    labels.forEach((label) => {
      row[label] = p.formdata?.[label] || "N/A";
    });

    return row;
  });

  // ---- STEP 3: GENERATE SHEET ----
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // ---- STEP 4: AUTO FILTER ON BATCH COLUMN ONLY ----
  const headerRow = ["S_No", ...labels];
  // const batchColIndex = headerRow.indexOf("Batch");  // find Batch column

  // if (batchColIndex !== -1) {
  //   worksheet["!autofilter"] = {
  //     ref: XLSX.utils.encode_range({
  //       s: { r: 0, c: batchColIndex },       // start at row 0, Batch column
  //       e: { r: participants.length, c: batchColIndex }, // end at last row, same column
  //     }),
  //   };
  // }

  // ---- STEP 5: AUTO COLUMN RESIZING ----
  const columnWidths = headerRow.map((h) => {
    let maxLength = h.length;

    excelData.forEach((row) => {
      const val = String(row[h] || "");
      if (val.length > maxLength) maxLength = val.length;
    });

    return { wch: maxLength + 2 }; // +2 padding
  });

  worksheet["!cols"] = columnWidths;

  // ---- STEP 6: EXPORT ----
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

  const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, `${eventName}-participants.xlsx`);
};
