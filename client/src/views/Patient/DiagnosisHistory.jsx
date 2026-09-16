import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";
import tokenService from "../../apiServices/token.service";

const DiagnosisHistory = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const state = location?.state;
  const user = tokenService.getUser();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (state?.appointments) {
      setLoading(true);
      const dat = state.appointments.filter(
        (appointment) => appointment.diagnosis
      );
      setData(dat);
      setLoading(false);
    }
  }, [state]);

  return (
    <div className="content-wrapper">
      {user.role !== "STAFF" && (
        <>
          <Row className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Col>
              <h6 className="mb-2 pb-1  fw-bold text-black">
                Diagnosis History
              </h6>
            </Col>
            <Col className="text-end">
              <Button
                href={state?.id ? `/patient-profile/${state?.id}` : "patients"}
                variant="primary"
              >
                Back
              </Button>
            </Col>
          </Row>
          <Can I="list" an="Appointment">
            <div
              id="pills-upcoming"
              role="tabpanel"
              aria-labelledby="pills-upcoming-tab"
              tabIndex="0"
            >
              {data.length > 0 ? (
                <div className="list">
                  {data.toReversed().map((appointment, index) => {
                    return (
                      <Can I="read" an="Appointment" passThrough key={index}>
                        {(allowed) => {
                          return (
                            appointment.diagnosis && (
                              <div className="list-item">
                                <a
                                  className="d-flex w-100"
                                  href={`/appointment-details/${appointment.id}`}
                                  disabled={!allowed}
                                  key={index}
                                >
                                  <div className="list-item-content">
                                    <span className="list-item__info">
                                      <strong className="text-dark">
                                        Date Time:{" "}
                                      </strong>
                                      {appointment.date}, {appointment.time}
                                    </span>
                                    <br />
                                    <span className="list-item__info">
                                      <strong className="text-dark">
                                        Daily Note:{" "}
                                      </strong>
                                      {appointment.doctor_note}
                                    </span>
                                    <br />
                                    <span className="list-item__info">
                                      <strong className="text-dark">
                                        Diagnosis:
                                      </strong>
                                      {appointment.diagnosis}
                                    </span>
                                  </div>
                                </a>
                              </div>
                            )
                          );
                        }}
                      </Can>
                    );
                  })}
                </div>
              ) : loading ? (
                <Loader />
              ) : (
                <div className="text-center">No History Available</div>
              )}
            </div>
          </Can>
        </>
      )}
    </div>
  );
};

export default DiagnosisHistory;
