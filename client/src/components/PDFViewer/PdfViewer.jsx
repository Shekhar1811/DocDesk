import React, { useEffect, useState } from "react";
import tokenService from "../../apiServices/token.service";
import { IMAGE_URL } from "../../constants";
import moment from "moment-timezone";

const PdfViewer = ({ invoice }) => {
  const [clinicData, setClinicData] = useState();

  useEffect(() => {
    const user = tokenService.getUser();
    if (user?.clinic) {
      setClinicData(user.clinic);
    } else if (invoice?.clinic) {
      setClinicData(invoice.clinic);
    }
  }, [invoice]);

  const activeClinic = clinicData || invoice?.clinic;

  return (
    <>
      {invoice && (
        <div
          id="divToPrint"
          style={{
            backgroundColor: "#ffffff",
            padding: "32px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: "#1e293b",
            maxWidth: "780px",
            margin: "0 auto",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingBottom: "20px",
              borderBottom: "2px solid #0284c7",
              marginBottom: "24px",
            }}
          >
            {/* Clinic Info */}
            <div style={{ flex: "1", maxWidth: "60%" }}>
              {activeClinic?.logo_url && (
                <img
                  src={activeClinic.logo_url.startsWith("http") ? activeClinic.logo_url : `${IMAGE_URL}${activeClinic.logo_url}`}
                  alt="Clinic Logo"
                  style={{ maxHeight: "55px", maxWidth: "200px", objectFit: "contain", marginBottom: "10px" }}
                />
              )}
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                {activeClinic?.name || "DocDesk Multi-Specialty Hospital & Clinic"}
              </h2>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
                {activeClinic?.address?.line1 ? `${activeClinic.address.line1}, ` : ""}
                {activeClinic?.address?.city || "Mumbai"}, {activeClinic?.address?.state || "Maharashtra"} - {activeClinic?.address?.zipcode || "400050"}
              </p>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                Phone: <strong style={{ color: "#334155" }}>{activeClinic?.phone || "+91 98765 43210"}</strong> | Email: <strong style={{ color: "#334155" }}>{activeClinic?.email || "billing@docdesk.health"}</strong>
              </p>
            </div>

            {/* Invoice Meta */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#166534",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                TAX INVOICE / RECEIPT
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0" }}>
                INV-00{invoice.id}
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                Date: <strong>{moment(invoice.payment_date || invoice.createdAt).format("MMMM DD, YYYY")}</strong>
              </p>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                Payment Mode: <strong style={{ color: "#0284c7" }}>{invoice.paid_by || "CASH"}</strong>
              </p>
            </div>
          </div>

          {/* Billed To / Patient Details */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "16px 20px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                Billed To (Patient)
              </span>
              <h4 style={{ margin: "4px 0 2px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                {invoice.patient?.name || "Patient"}
              </h4>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b" }}>
                {invoice.patient?.address?.line1 ? `${invoice.patient.address.line1}, ` : ""}
                {invoice.patient?.address?.city || "Mumbai"}
                {invoice.patient?.address?.zipcode ? ` - ${invoice.patient.address.zipcode}` : ""}
              </p>
              {invoice.patient?.mobile && (
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                  Mobile: <strong>{invoice.patient.mobile}</strong>
                </p>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                Department
              </span>
              <p style={{ margin: "4px 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                General Medicine &amp; Clinical Care
              </p>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                Status
              </span>
              <p style={{ margin: "2px 0 0 0", fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>
                PAID &bull; RECEIPT ISSUED
              </p>
            </div>
          </div>

          {/* Itemized Charges Table */}
          <div style={{ marginBottom: "24px" }}>
            <h5 style={{ fontSize: "13px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              Clinical Services &amp; Charges Summary
            </h5>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", color: "#334155", fontWeight: "700" }}>#</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", color: "#334155", fontWeight: "700" }}>Service Description</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontSize: "12px", color: "#334155", fontWeight: "700" }}>Qty</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontSize: "12px", color: "#334155", fontWeight: "700" }}>Unit Rate</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontSize: "12px", color: "#334155", fontWeight: "700" }}>Total (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                  invoice.invoice_items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "12px", fontSize: "12px", color: "#64748b" }}>{idx + 1}</td>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{item.description}</td>
                      <td style={{ padding: "12px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>{item.quantity || 1}</td>
                      <td style={{ padding: "12px", textAlign: "right", fontSize: "12px", color: "#64748b" }}>Rs. {item.unit_price}</td>
                      <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Rs. {item.total_price}</td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px", fontSize: "12px", color: "#64748b" }}>1</td>
                    <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                      {invoice.description || "Clinical Consultation, Diagnostics & Digital Prescription"}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>1</td>
                    <td style={{ padding: "12px", textAlign: "right", fontSize: "12px", color: "#64748b" }}>Rs. {invoice.amount}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Rs. {invoice.amount}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & QR Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingTop: "16px",
              borderTop: "1px solid #e2e8f0",
              marginBottom: "28px",
            }}
          >
            {/* UPI QR Code */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              {activeClinic?.scanner_url && (
                <img
                  src={activeClinic.scanner_url.startsWith("http") ? activeClinic.scanner_url : `${IMAGE_URL}${activeClinic.scanner_url}`}
                  alt="UPI Payment QR Code"
                  style={{ width: "90px", height: "90px", objectFit: "contain", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                />
              )}
              <div>
                <p style={{ margin: "0", fontSize: "11px", fontWeight: "700", color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Instant UPI Scan to Pay
                </p>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748b" }}>
                  GPay &bull; PhonePe &bull; Paytm &bull; BHIM
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "10px", color: "#94a3b8" }}>
                  Official Clinic Payment Terminal
                </p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div style={{ width: "240px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px", color: "#64748b" }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: "600", color: "#334155" }}>Rs. {invoice.amount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", color: "#64748b" }}>
                <span>Healthcare GST (0%):</span>
                <span style={{ fontWeight: "600", color: "#334155" }}>Rs. 0</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "8px",
                  borderTop: "2px solid #0f172a",
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                <span>Grand Total:</span>
                <span style={{ color: "#0284c7" }}>Rs. {invoice.amount}</span>
              </div>
            </div>
          </div>

          {/* Clean Medical Recovery Footer */}
          <div
            style={{
              textAlign: "center",
              paddingTop: "20px",
              borderTop: "1px dashed #cbd5e1",
              color: "#64748b",
              fontSize: "12px",
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontWeight: "700", color: "#334155", fontSize: "13px" }}>
              Thank you for placing your trust in {activeClinic?.name || "DocDesk Hospital & Clinic"}.
            </p>
            <p style={{ margin: "0", color: "#0284c7", fontWeight: "600" }}>
              Wishing you good health and a speedy recovery!
            </p>
            <p style={{ margin: "8px 0 0 0", fontSize: "10px", color: "#94a3b8" }}>
              This is an authenticated computer-generated clinical invoice. No signature required.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PdfViewer;
