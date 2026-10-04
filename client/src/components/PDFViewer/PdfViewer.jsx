import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import tokenService from "../../apiServices/token.service";
import { IMAGE_URL } from "../../constants";
import moment from "moment-timezone";

const PdfViewer = ({ invoice }) => {
  const [clinicData, setClinicData] = useState();
  useEffect(() => {
    const { clinic } = tokenService.getUser();
    setClinicData(clinic);
  }, []);

  return (
    <>
      {invoice && clinicData && (
        <div
          id="divToPrint"
          style={{
            backgroundColor: "white",
            padding: "16px",
            fontFamily: "Arial, sans-serif", 
          }}
        >
          <div
            className="container"
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <header>
              <div
                className="header-content"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <img
                    src={`${IMAGE_URL + clinicData?.logo?.url}`}
                    alt="Clinic Logo"
                    style={{ maxWidth: "190px", height: "auto" }}
                  />
                </div>
                <div>
                  <h1 style={{ fontSize: "24px", margin: "0" }}>
                    {clinicData.name}
                  </h1>
                  <p style={{ fontWeight: "bold", margin: "0" }}>
                    Clinic Address:
                  </p>
                  <p style={{ margin: "0" }}>
                    {clinicData?.address.city}, {clinicData?.address.state}-
                    {clinicData?.address.zipcode} (India)
                  </p>
                  <p style={{ fontWeight: "bold", margin: "0" }}>
                    Phone: {clinicData?.phone}
                  </p>
                </div>
                <div>
                  {/* <p style={{ fontWeight: "bold", margin: "0" }}>
                    {invoice.patient.name}
                  </p> */}

                  <p style={{ fontWeight: "bold", margin: "0" }}>
                    Invoice: {invoice.id}
                  </p>

                  <div
                    className="date"
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      marginBottom: "20px",
                    }}
                  >
                    Date: {moment(invoice.payment_date).format("MMMM DD, yyyy")}
                    {/* Date: September 18, 2024 */}
                    {/* {invoice.payment_date} */}
                  </div>
                </div>
              </div>

              <div
                className="patient-qr"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "1px solid #ddd",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <div className="patient-details" style={{ flex: "1" }}>
                  <p style={{ fontWeight: "bold", margin: "0" }}>
                    Patient Details:
                  </p>
                  <h4 style={{ margin: "0" }}> {invoice.patient.name}</h4>
                  {/*  <p style={{ margin: "0" }}>
                    Date of Birth:{" "}
                    {moment(appointment.patient.date_of_birth).format(
                      "MMMM DD, yyyy"
                    )}
                  </p>
                  <p style={{ margin: "0" }}>
                    Gender: {appointment.patient.gender}
                  </p> */}
                </div>
                <div className="qr-code" style={{ textAlign: "right" }}>
                  <img
                   
                    src={`${IMAGE_URL + clinicData?.scanner?.url}`}
                    alt="Payment QR Code"
                    style={{ maxWidth: "100px", height: "auto" }}
                  />
                  <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                    Scan to Pay
                  </p>
                </div>
              </div>
            </header>
            <br />
            <section>
              <h4>Prescription Details</h4>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        backgroundColor: "#f4f4f4",
                        textAlign: "left",
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        backgroundColor: "#f4f4f4",
                        textAlign: "right",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice && (
                    <>
                      <tr>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {invoice.description}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right",}}
                        >
                          Rs {invoice.amount}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            textAlign: "right",
                          }}
                        >
                          <strong>Total</strong>
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            textAlign: "right",
                            width: "100px",
                          }}
                        >
                          <strong>Rs {invoice.amount} </strong>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
              <br />
              <div className="footer-message text-center">
                <p>Thank you for choosing {invoice?.clinic?.name || "DocDesk Hospital & Clinic"}.</p>
                <p>Wishing you good health and a speedy recovery!</p>
              </div>
            </section>

            {/* <div
              className="signature-section"
              style={{
                textAlign: "right",
                marginTop: "30px",
                borderTop: "1px solid #ddd",
                paddingTop: "10px",
              }}
            >
              <br />
              <p>Doctor's Signature:</p>
              <br />
              <br />
              <p>______________________________</p>
              <p>Dr. {appointment?.doctor?.name}</p>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default PdfViewer;
