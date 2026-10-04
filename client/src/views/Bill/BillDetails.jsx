import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Can } from "../../context/AuthProvider";
import { handleValidationError, useMediaQuery } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import PDFViewerComponent from "../../components/PDFViewer/PdfViewer";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Bill = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState();
  const [showInvoice, setShowInvoice] = useState(false);
  const alert = useAlert();
  const is_mobile = useMediaQuery('(max-width: 768px)');
  //const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  //const isDesktop = useMediaQuery('(min-width: 1025px)');
  useEffect(() => {
    setLoading(true);
    dataServices
      .getInvoiceDetails(id)
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
  }, []);

  const handleSend = (invoice) => {
    const rawMobile = invoice?.patient?.mobile || "";
    const cleanMobile = rawMobile.replace(/[^\d]/g, "");
    const invoiceId = invoice?.id || "";
    // Create WhatsApp link with real invoice ID
    const message = `Dear ${invoice?.patient?.name || "Patient"}, Your invoice no. ${invoiceId} of Rs. ${invoice?.amount || 0} is now due. Please make the payment as soon as possible. If you have already paid, please ignore this message. The invoice URL is https://${window.location.host}/print-invoice/${invoiceId}\n\nThank you!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappWebUrl = is_mobile
      ? `https://api.whatsapp.com/send?phone=${cleanMobile}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanMobile}&text=${encodedMessage}`;

    return whatsappWebUrl;
  };

  const printDocument = () => {
    const input = document.getElementById("divToPrint");
    if (!input) return;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => { 
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`DocDesk-Invoice-${invoice?.id || "receipt"}.pdf`);
    });
  };


  return (
    <div className="content-wrapper">
      <Can I="read" an="Invoice">
        <div className="mt-4">
          <Card className="rounded-4 px-3 pt-3 overflow-hidden mb-3">
            <Card.Body>
              <Card.Title as="h6" className="pb-2">
                Invoice Info
              </Card.Title>
              {invoice ? (
                <>
                  <Row className="d-flex">
                    <Col>
                      <p>
                        <span className="text-muted small">Patient Name</span>
                        <br />
                        {invoice.patient.name}
                      </p>
                    </Col>
                    <Col>
                      <p>
                        <span className="text-muted small">Date</span>
                        <br />
                        {invoice.payment_date}
                      </p>
                    </Col>
                  </Row>
                  <Row className="d-flex">
                    <Col>
                      <p>
                        <span className="text-muted small">Invoice No.</span>
                        <br />
                        {invoice.id}
                      </p>
                    </Col>
                    <Col>
                      <p>
                        <span className="text-muted small">Payment Method</span>
                        <br />
                        {invoice.paid_by}
                      </p>
                    </Col>
                  </Row>
                  <Row className="d-flex">
                    <Col>
                      <p>
                        <span className="text-muted small">
                          Transaction ID or cheque number
                        </span>
                        <br />
                        {invoice.transaction_number}
                      </p>
                    </Col>
                    <Col>
                      <p>
                        <span className="text-muted small">Amount</span>
                        <br />
                        {invoice.amount}
                      </p>
                    </Col>
                  </Row>
                  <Row className="d-flex">
                    <Col className="text-end">
                    {showInvoice && (
                        <a href={handleSend(invoice)} className="btn btn-primary me-2" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-whatsapp me-1"></i>Share on WhatsApp
                      </a>
                      )}
                      <Button
                        variant="primary"
                        onClick={() =>
                          showInvoice ? printDocument() : setShowInvoice(true)
                        }
                        size="sm"
                      >
                        {showInvoice ? "Print" : "Print preview"}
                      </Button>
                      {showInvoice && (
                        <Button
                          variant="danger"
                          className="ms-2"
                          onClick={() => setShowInvoice(false)}
                          size="sm"
                        >
                          Close
                        </Button>
                      )}
                    </Col>
                  </Row>
                  {/* <Can I="edit" an="Invoice">
                    <a
                      href={`/edit-invoice/${invoice.id}`}
                      className="link-dark"
                    >
                      <div className="edit-profile-icon bg-primary text-white">
                        <span className="material-symbols-outlined h2 m-0">
                          edit
                        </span>
                      </div>
                    </a>
                  </Can> */}
                </>
              ) : (
                loading && <Loader />
              )}
            </Card.Body>
          </Card>
        </div>
      </Can>
      {showInvoice && <PDFViewerComponent invoice={invoice} />}
    </div>
  );
};

export default Bill;
