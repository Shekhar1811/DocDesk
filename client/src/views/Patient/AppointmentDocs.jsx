import React, { useEffect, useState } from "react";
import dataServices from "../../apiServices/data.services";
import { handleValidationError } from "./../../components/CommonFunctions";
import { Col, Row } from "react-bootstrap";
import { IMAGE_URL } from "../../constants";
import { Link } from "react-router-dom";

const AppointmentDocs = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [appointmentDocs, setAppointmentDocs] = useState([]);

  const getAppointmentDocs = () => {
    setLoading(true);
    dataServices
      .getAppointmentDocs(id)
      .then((res) => {
        if (res.status === 200) {
          const result = res.data;
          setAppointmentDocs(result);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAppointmentDocs();
  }, [id]);
  return (
    <>
      {appointmentDocs.map((appointment) => (
        <div key={appointment.id} className="mb-4">
          <Link to={"/appointment-details/" + appointment.id}>
            Appointment ID: {appointment.id}
          </Link>
          <Row>
            {appointment.assets.map((asset) => {
              const type = asset.mime_type ? asset.mime_type.slice(-3) : null;
              const fileURL = IMAGE_URL + asset.url;

              return (
                <Col
                  key={asset.id}
                  lg={2}
                  md={2}
                  sm={3}
                  xs={4}
                  className="position-relative text-center mb-3"
                >
                  <Link to={fileURL} target="_blank">
                    {type === "pdf" ? (
                      <img
                        src="/img/pdf-icon.png"
                        alt={asset.file_name}
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src={fileURL}
                        alt={asset.file_name}
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Link>
                </Col>
              );
            })}
          </Row>
        </div>
      ))}
    </>
  );
};

export default AppointmentDocs;
