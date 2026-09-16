import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import tokenService from "../../apiServices/token.service";
import { IMAGE_URL } from "../../constants";
import moment from "moment-timezone";

const PrescriptionPDFComponent = ({ prescriptions, appointment }) => {
  const [clinicData, setClinicData] = useState();
  useEffect(() => {
    const { clinic } = tokenService.getUser();
    setClinicData(clinic);
  }, []);
  return (
    <>
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
                flexWrap:"wrap",
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
                  Dr. {appointment.doctor.name}
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
                <p style={{ fontWeight: "bold", margin: "0" }}>
                  Appointment No.: {appointment.id}{" "}
                </p>

                <p style={{ fontWeight: "bold", margin: "0" }}>
                  Registration No: {clinicData?.number}
                </p>

                <div
                  className="date"
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  Date: {moment(new Date()).format("MMMM DD, yyyy")}
                  {/* Date: September 18, 2024 */}
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
                <h4 style={{ margin: "0" }}>{appointment.patient.name}</h4>
                <p style={{ margin: "0" }}>
                  Date of Birth:{" "}
                  {moment(appointment.patient.date_of_birth).format(
                    "MMMM DD, yyyy"
                  )}
                </p>
                <p style={{ margin: "0" }}>
                  Gender: {appointment.patient.gender}
                </p>
              </div>
              <div className="qr-code" style={{ textAlign: "right" }}>
                <img
                  //   src="https://support.thinkific.com/hc/article_attachments/360042081334/5d37325ea1ff6.png"
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
                    Medication
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f4f4f4",
                      textAlign: "left",
                    }}
                  >
                    Dosage & Instructions
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f4f4f4",
                      textAlign: "left",
                    }}
                  >
                    Duration
                  </th>
                  {/* <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f4f4f4",
                      textAlign: "left",
                    }}
                  >
                    Total Count
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {prescriptions &&
                  prescriptions.map((pres) => {
                    return (
                      <tr key={pres.id}>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {pres.medicine}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {pres.dosages}
                          <br />
                          <small>{pres.instruction || "After Meal"}</small>
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {pres.duration}
                        </td>
                        {/* <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        20 tablets
                      </td> */}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </section>

          <section style={{ marginTop: "20px" }}>
            <h5>Notes</h5>
            {prescriptions && prescriptions.map((pres) => <p>{pres.notes}</p>)}
            <p>
              For any follow-up appointments or concerns, please reach out to
              the clinic at {clinicData?.phone}.
            </p>
          </section>

          <div
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
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionPDFComponent;
