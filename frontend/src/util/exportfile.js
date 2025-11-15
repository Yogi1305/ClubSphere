import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportParticipantsToExcel = (participants, eventName) => {
  if (!participants || participants.length === 0) return;

  const excelData = participants.map((p, index) => ({
    S_No: index + 1,
    Name: p.UserId?.fullName || "N/A",
    Email: p.UserId?.email || "N/A",
    Batch: p.UserId?.batch || "N/A",
    Contact: p.UserId?.contact || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

  const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, `${eventName}-participants.xlsx`);
};
