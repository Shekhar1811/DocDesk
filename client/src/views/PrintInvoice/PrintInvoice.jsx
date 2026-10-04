import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Button, Container } from "react-bootstrap";
import "./Invoice.css";
import { useAlert } from "react-alert";
import { handleValidationError } from "../../components/CommonFunctions";
import { IMAGE_URL } from "../../constants";
import moment from "moment-timezone";

const PrintInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState();
  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getPrintInvoiceDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setInvoice(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loader />;

  if (!invoice) {
    return (
      <Container className="text-center py-5">
        <h4 className="text-muted">Invoice not found</h4>
        <Button variant="primary" className="mt-3" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  const clinic = invoice.clinic;
  const patient = invoice.patient;

  return (
    <div className="invoice-page-wrapper">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="invoice-action-bar no-print">
        <div className="d-flex align-items-center justify-content-between">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate(-1)}
            className="d-flex align-items-center gap-1"
          >
            &larr; Back
          </Button>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="d-flex align-items-center gap-2 shadow-sm fw-bold px-3"
            >
              <span>🖨️</span> Print / Save as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Invoice Sheet */}
      <div className="invoice-sheet" id="invoiceSheet">
        {/* Header */}
        <div className="invoice-header">
          <div className="clinic-brand">
            {clinic?.logo_url && (
              <img
                src={clinic.logo_url.startsWith("http") ? clinic.logo_url : `${IMAGE_URL}${clinic.logo_url}`}
                alt="Clinic Logo"
                className="clinic-logo-img"
              />
            )}
            <h2 className="clinic-title">{clinic?.name || "DocDesk Multi-Specialty Hospital & Clinic"}</h2>
            <p className="clinic-meta">
              {clinic?.address?.line1 ? `${clinic.address.line1}, ` : ""}
              {clinic?.address?.line2 ? `${clinic.address.line2}, ` : ""}
              {clinic?.address?.city || "Mumbai"}, {clinic?.address?.state || "Maharashtra"} - {clinic?.address?.zipcode || "400050"} (India)
            </p>
            <p className="clinic-meta">
              Phone: <strong>{clinic?.phone || "+91 98765 43210"}</strong> | Email: <strong>{clinic?.email || "billing@docdesk.health"}</strong>
            </p>
          </div>

          <div className="invoice-meta-badge">
            <span className="badge-pill">TAX INVOICE / RECEIPT</span>
            <h3 className="invoice-number">INV-00{invoice.id}</h3>
            <p className="meta-text">
              Date: <strong>{moment(invoice.payment_date).format("MMMM DD, YYYY")}</strong>
            </p>
            <p className="meta-text">
              Payment Mode: <strong className="text-primary">{invoice.paid_by || "CASH"}</strong>
            </p>
            <p className="meta-text">
              Status: <span className="status-paid">&bull; PAID</span>
            </p>
          </div>
        </div>

        {/* Patient & Billing Details Bar */}
        <div className="patient-card">
          <div className="patient-col">
            <span className="section-label">Billed To (Patient)</span>
            <h4 className="patient-name">{patient?.name || "Patient"}</h4>
            <p className="patient-sub">
              {patient?.address?.line1 ? `${patient.address.line1}, ` : ""}
              {patient?.address?.city || "Mumbai"}
              {patient?.address?.zipcode ? ` - ${patient.address.zipcode}` : ""} (India)
            </p>
            {patient?.mobile && (
              <p className="patient-sub">
                Contact: <strong>{patient.mobile}</strong>
              </p>
            )}
          </div>

          <div className="patient-col text-end">
            <span className="section-label">Medical Center</span>
            <p className="dept-title">Outpatient Clinical Practice</p>
            <span className="section-label">Authorized Facility</span>
            <p className="patient-sub">DocDesk Healthcare Operations</p>
          </div>
        </div>

        {/* Services & Itemized Table */}
        <div className="table-responsive">
          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th>Service / Treatment Description</th>
                <th className="text-center" style={{ width: "70px" }}>Qty</th>
                <th className="text-end" style={{ width: "120px" }}>Rate (Rs.)</th>
                <th className="text-end" style={{ width: "130px" }}>Total (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                invoice.invoice_items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold text-dark">{item.description}</td>
                    <td className="text-center">{item.quantity || 1}</td>
                    <td className="text-end">Rs. {item.unit_price}</td>
                    <td className="text-end fw-bold">Rs. {item.total_price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>1</td>
                  <td className="fw-semibold text-dark">
                    {invoice.description || "Clinical Consultation, Diagnostics & Digital Prescription"}
                  </td>
                  <td className="text-center">1</td>
                  <td className="text-end">Rs. {invoice.amount}</td>
                  <td className="text-end fw-bold">Rs. {invoice.amount}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Settlement & UPI QR Section */}
        <div className="settlement-row">
          {/* UPI Scan to Pay */}
          <div className="upi-box">
            {clinic?.scanner_url && (
              <img
                src={clinic.scanner_url.startsWith("http") ? clinic.scanner_url : `${IMAGE_URL}${clinic.scanner_url}`}
                alt="UPI Payment QR"
                className="qr-img"
              />
            )}
            <div className="upi-details">
              <span className="upi-title">Instant UPI Scan to Pay</span>
              <p className="upi-apps">GPay &bull; PhonePe &bull; Paytm &bull; BHIM</p>
              <p className="upi-note">Scan with any UPI app to verify or pay</p>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="totals-box">
            <div className="totals-line">
              <span>Subtotal:</span>
              <span className="fw-semibold">Rs. {invoice.amount}</span>
            </div>
            <div className="totals-line">
              <span>Healthcare Tax / GST (0%):</span>
              <span className="fw-semibold">Rs. 0</span>
            </div>
            <div className="grand-total-line">
              <span>Grand Total:</span>
              <span className="grand-total-amount">Rs. {invoice.amount}</span>
            </div>
          </div>
        </div>

        {/* Clinical Recovery Footer */}
        <div className="invoice-footer-message">
          <p className="footer-title">
            Thank you for placing your trust in {clinic?.name || "DocDesk Multi-Specialty Hospital & Clinic"}.
          </p>
          <p className="footer-recovery">
            Wishing you good health and a speedy recovery!
          </p>
          <p className="footer-legal">
            Computer-generated authenticated receipt. For questions or clinical billing records, please contact clinic administration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoice;
