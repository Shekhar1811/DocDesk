import { utils, writeFile } from "xlsx";

export const exportToExcel = (data) => {
  // Convert data to a format suitable for sheet creation
  const formattedData = data.map((report, i) => ({
    SrNo: i + 1,
    Name: report.patient.name,
    Description: report.description,
    PaymentDate: report.payment_date,
    PaidBy: report.paid_by,
    TransactionNumber: report.transaction_number || "N/A",
    Status: report.status,
    Amount: parseFloat(report.amount),
  }));

  // Calculate the total amount
  const totalAmount = formattedData.reduce((sum, item) => sum + item.Amount, 0);

  // Add the total row at the end
  formattedData.push({
    SrNo: "",
    Name: "",
    Description: "",
    PaymentDate: "",
    PaidBy: "",
    TransactionNumber: "",
    Status: "Total Amount",
    Amount: totalAmount,
  });

  // Create a worksheet from the formatted data
  const ws = utils.json_to_sheet(formattedData);

  // Create a new workbook and append the worksheet
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Invoice Data");

  // Write the workbook to an Excel file
  writeFile(wb, "InvoiceData.xlsx");
};
