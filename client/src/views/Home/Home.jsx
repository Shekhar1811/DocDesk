import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";

const Home = () => {
  const [stats, setStats] = useState();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(1);
  const alert = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getStats(days)
      .then((res) => {
        if (res.status === 200) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [days]);

  return (
    <Can I="read" this="Home">
      <div className="content-wrapper">
        <br />
        <div className="d-flex">
          <div>
            <Button
              variant={days === 1 ? "primary" : "outline-primary"}
              onClick={() => setDays(1)}
              className="me-2"
            >
              Today
            </Button>
          </div>
          <div>
            <Button
              variant={days === 7 ? "primary" : "outline-primary"}
              onClick={() => setDays(7)}
              className="me-2"
            >
              Week
            </Button>
          </div>
          <div>
            <Button
              variant={days === 30 ? "primary" : "outline-primary"}
              onClick={() => setDays(30)}
              className="me-2"
            >
              This Month
            </Button>
          </div>
        </div>
        <br />
        <Row className="g-6 mb-6">
          <h4>Dashboard</h4>
          {loading ? (
            <div className="py-4">
              <Loader />
            </div>
          ) : stats ? (
            <>
              <Col xl={3} sm={6} className="mb-3">
                <Card
                  className="shadow border-0 clickable-stat-card"
                  onClick={() => navigate("/invoice")}
                >
                  <Card.Body>
                    <Row>
                      <Col>
                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                          Earnings
                        </span>
                        <span className="h3 font-bold mb-0">
                          {stats.total_amount}
                        </span>
                        <small className="mb-0">/-</small>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white text-lg rounded-circle d-flex align-items-center justify-content-center">
                          <span className="material-symbols-outlined">
                            payments
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-2 mb-0 text-sm">
                          <Badge bg="primary">Online - {stats.total_online_invoices}</Badge>
                        </div>
                      </Col>
                      <Col>
                        <div className="mt-2 mb-0 text-sm">
                          <Badge bg="success">Cash - {stats.total_cash_invoices}</Badge>
                        </div>
                      </Col>
                      <Col>
                        <div className="mt-2 mb-0 text-sm">
                          <Badge bg="secondary">Cheque - {stats.total_check_invoices}</Badge>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={3} sm={6} className="mb-3">
                <Can I="list" this="Invoice" passThrough>
                  {(allowed) => (
                    <Card
                      className="shadow border-0 clickable-stat-card"
                      onClick={() => allowed && navigate("/invoice")}
                    >
                      <Card.Body>
                        <Row>
                          <Col>
                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                              Invoice
                            </span>
                            <span className="h3 font-bold mb-0">
                              {stats.total_invoices}
                            </span>
                          </Col>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-warning text-white text-lg rounded-circle d-flex align-items-center justify-content-center">
                              <span className="material-symbols-outlined">
                                receipt_long
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  )}
                </Can>
              </Col>
              <Col xl={3} sm={6} xs={12} className="mb-3">
                <Can I="list" this="Patient" passThrough>
                  {(allowed) => (
                    <Card
                      className="shadow border-0 clickable-stat-card"
                      onClick={() => allowed && navigate("/patients")}
                    >
                      <Card.Body>
                        <Row>
                          <Col>
                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                              Patients
                            </span>
                            <span className="h3 font-bold mb-0">
                              {stats.total_patients}
                            </span>
                          </Col>
                          <Can I="add" this="Patient" passThrough>
                            {(canAdd) => (
                              <Col className="col-auto">
                                <Button
                                  variant="link"
                                  className="p-0 border-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (canAdd) navigate("/add-patient");
                                  }}
                                >
                                  <div className="icon icon-shape bg-info text-white text-lg rounded-circle d-flex align-items-center justify-content-center">
                                    <span className="material-symbols-outlined">
                                      add
                                    </span>
                                  </div>
                                </Button>
                              </Col>
                            )}
                          </Can>
                        </Row>
                      </Card.Body>
                    </Card>
                  )}
                </Can>
              </Col>
              <Col xl={3} sm={6} xs={12} className="mb-3">
                <Can I="list" this="Appointment" passThrough>
                  {(allowed) => (
                    <Card
                      className="shadow border-0 clickable-stat-card"
                      onClick={() => allowed && navigate("/appointments")}
                    >
                      <Card.Body>
                        <Row>
                          <Col>
                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                              Appointments
                            </span>
                            <span className="h3 font-bold mb-0">
                              {stats.total_appointments}
                            </span>
                          </Col>
                          <Can I="add" this="Appointment" passThrough>
                            {(canAdd) => (
                              <Col className="col-auto">
                                <Button
                                  variant="link"
                                  className="p-0 border-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (canAdd) navigate("/request-appointment");
                                  }}
                                >
                                  <div className="icon icon-shape bg-warning text-white text-lg rounded-circle d-flex align-items-center justify-content-center">
                                    <span className="material-symbols-outlined">
                                      add
                                    </span>
                                  </div>
                                </Button>
                              </Col>
                            )}
                          </Can>
                        </Row>
                      </Card.Body>
                    </Card>
                  )}
                </Can>
              </Col>
            </>
          ) : null}
        </Row>
        <br />
        <div className="row row-cols-4 g-2">
          <div className="col">
            <div className="bg-white text-center rounded-4 p-2 shadow-sm">
              <Can I="list" this="Doctor" passThrough>
                {(allowed) => (
                  <Link
                    to={allowed ? "/doctors" : "#"}
                    className="link-dark text-decoration-none"
                    style={{ pointerEvents: allowed ? "auto" : "none", opacity: allowed ? 1 : 0.6 }}
                  >
                    <img
                      src="img/home/doctor.png"
                      alt="Doctor"
                      className="img-fluid px-2"
                    />
                    <p className="text-truncate small pt-2 m-0 fw-medium">Doctor</p>
                  </Link>
                )}
              </Can>
            </div>
          </div>
          <div className="col">
            <div className="bg-white text-center rounded-4 p-2 shadow-sm">
              <Can I="list" this="Appointment" passThrough>
                {(allowed) => (
                  <Link
                    to={allowed ? "/appointments" : "#"}
                    className="link-dark text-decoration-none"
                    style={{ pointerEvents: allowed ? "auto" : "none", opacity: allowed ? 1 : 0.6 }}
                  >
                    <img
                      src="img/home/schedule.png"
                      alt="Appointment"
                      className="img-fluid px-2"
                    />
                    <p className="text-truncate small pt-2 m-0 fw-medium">Appointment</p>
                  </Link>
                )}
              </Can>
            </div>
          </div>
          <div className="col">
            <div className="bg-white text-center rounded-4 p-2 shadow-sm">
              <Can I="list" this="Invoice" passThrough>
                {(allowed) => (
                  <Link
                    to={allowed ? "/invoice" : "#"}
                    className="link-dark text-decoration-none"
                    style={{ pointerEvents: allowed ? "auto" : "none", opacity: allowed ? 1 : 0.6 }}
                  >
                    <img
                      src="img/home/prescription.png"
                      alt="Invoice"
                      className="img-fluid px-2"
                    />
                    <p className="text-truncate small pt-2 m-0 fw-medium">Invoice</p>
                  </Link>
                )}
              </Can>
            </div>
          </div>
          <div className="col">
            <div className="bg-white text-center rounded-4 p-2 shadow-sm">
              <Can I="list" this="Employee" passThrough>
                {(allowed) => (
                  <Link
                    to={allowed ? "/employees" : "#"}
                    className="link-dark text-decoration-none"
                    style={{ pointerEvents: allowed ? "auto" : "none", opacity: allowed ? 1 : 0.6 }}
                  >
                    <img
                      src="img/home/medicine.png"
                      alt="Employee"
                      className="img-fluid px-2"
                    />
                    <p className="text-truncate small pt-2 m-0 fw-medium">Employee</p>
                  </Link>
                )}
              </Can>
            </div>
          </div>
        </div>
        <br />
      </div>
    </Can>
  );
};

export default Home;
