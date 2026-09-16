import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import "../PrintInvoice/Invoice.css"
import { useAlert } from "react-alert";
import { handleValidationError } from "../../components/CommonFunctions";
import { IMAGE_URL } from "../../constants";
import Image from "react-bootstrap/Image";

const PrintInvoice = () => {
  const { id } = useParams();
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
  }, []);

return (
<div className="container-invoice">
      <div className="header">
        <div className="logo">
          {/* Use an image path or import it as a module */}
          
          <Image
                        src={IMAGE_URL + invoice?.clinic?.logo_url}
                        rounded
                        fluid
                        className="logo-img"
                      />
        </div>
        <div className="invoice-info">
          <br />
        <h4>{invoice?.clinic?.name}</h4>
          <p>Clinic Address: {invoice?.clinic?.address?.line1 ? invoice?.clinic?.address?.line1+", " :""}{invoice?.clinic?.address?.line2 ? invoice?.clinic?.address?.line2+", " :""}{invoice?.clinic?.address?.city}, {invoice?.clinic?.address?.state}-{invoice?.clinic?.address?.zipcode} (India)</p>
          {invoice?.clinic?.phone ? 
           <p>Phone: {invoice.clinic.phone}</p> : ""
        }
          <p><strong>Invoice:</strong> {invoice?.id}</p>
          <p><strong>Date:</strong> {invoice?.payment_date}</p>
        </div>
      </div>

      <div className="patient-details">
        <p><strong>Patient Details:</strong></p>
        <p>{invoice?.patient?.name}</p>
        <p>Address: {invoice?.patient?.address?.line1 ? invoice?.patient?.address?.line1+", " :""}{invoice?.patient?.address?.line2 ? invoice?.patient?.address?.line2+", " :""}{invoice?.patient?.address?.city}, {invoice?.patient?.address?.state}-{invoice?.patient?.address?.zipcode} (India)</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th width="100" align="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{invoice?.description}</td>
            <td> {invoice?.amount}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="total">Total Rs.</td>
            <td> {invoice?.amount}</td>
          </tr>
        </tfoot>
      </table>

      <div className="payment-qr">
        <p><strong>Payment QR Code:</strong></p>
        <p>Scan to Pay</p>
        <Image
            src={IMAGE_URL + invoice?.clinic?.scanner_url}
            rounded
            fluid
            className="logo-img"
          />
      </div>

      <div className="footer-message">
        <p>Thank you for your visit!</p>
        <p>We hope to see you again soon!</p>
      </div>
    </div>
  );
};

export default PrintInvoice;
