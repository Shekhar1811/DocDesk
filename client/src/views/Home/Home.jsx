import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";

const Home = () => {
  const [stats, setStats] = useState();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(1);
  const alert = useAlert();
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
              variant="outline-primary"
              onClick={() => setDays(1)}
              className={`me-1 ${days === 1 && "active"} `}
            >
              Today
            </Button>
          </div>
          <div>
            <Button
              variant="outline-primary"
              onClick={() => setDays(7)}
              className={`me-1 ${days === 7 && "active"} `}
            >
              Week
            </Button>
          </div>
          <div>
            <Button
              variant="outline-primary"
              onClick={() => setDays(30)}
              className={`me-1 ${days === 30 && "active"} `}
            >
              This Month
            </Button>
          </div>
        </div>
        <br />
        <Row className="g-6 mb-6  ">
          <h4>Dashboard</h4>
          {stats && !loading ? (
            <>
              <Col xl={3} sm={6} className="mb-3">
                <Card className="shadow border-0">
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
                        <a
                          href=""
                          className="icon icon-shape bg-info text-white text-lg rounded-circle"
                        >
                          <span className="material-symbols-outlined">
                            payments
                          </span>
                        </a>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-2 mb-0 text-sm">
                          <Badge>Online - {stats.total_online_invoices}</Badge>
                        </div>
                      </Col>
                      <Col>
                        <div className="mt-2 mb-0 text-sm">
                          <Badge>Cash - {stats.total_cash_invoices}</Badge>
                        </div>
                      </Col>
                      <Col>
                        <div className="mt-2 mb-0 text-sm">
                          <Badge>Ceque - {stats.total_check_invoices}</Badge>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={3} sm={6} className="mb-3">
                <Card className="shadow border-0">
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
                      <Can I="list" this="Invoice" passThrough>
                        {(allowed) => (
                          <Col className="col-auto">
                            <a
                              href="/invoice"
                              className="icon icon-shape bg-warning text-white text-lg rounded-circle"
                              disabled={!allowed}
                            >
                              <span className="material-symbols-outlined">
                                receipt_long
                              </span>
                            </a>
                          </Col>
                        )}
                      </Can>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={3} sm={6} xs={12} className="mb-3">
                <Card className="shadow border-0">
                  <Card.Body>
                    <Row>
                      <Can I="list" this="Patient" passThrough>
                        {(allowed) => (
                          <Col>
                            <Link
                              to="/patients"
                              className="h6 font-semibold text-muted text-sm d-block mb-2"
                              disabled={!allowed}
                            >
                               Patients
                            </Link>
                            <span className="h3 font-bold mb-0">
                              {stats.total_patients}
                            </span>
                          </Col>
                        )}
                      </Can>
                      <Can I="add" this="Patient" passThrough>
                        {(allowed) => (
                          <Col className="col-auto">
                            <Link
                              to="/add-patient"
                              className="icon icon-shape bg-info text-white text-lg rounded-circle"
                              // variant="light"
                              disabled={!allowed}
                            >
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </Link>
                          </Col>
                        )}
                      </Can>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={3} sm={6} xs={12} className="mb-3">
                <Card className="shadow border-0">
                  <Card.Body>
                    <Row>
                      <Can I="list" this="Appointment" passThrough>
                        {(allowed) => (
                          <Col>
                            <Link
                              to="/appointments"
                              disabled={!allowed}
                              className="h6 font-semibold text-muted text-sm d-block mb-2"
                            >
                               Appointments
                            </Link>
                            <span className="h3 font-bold mb-0">
                              {stats.total_appointments}
                            </span>
                          </Col>
                        )}
                      </Can>
                      <Can I="add" this="Appointment" passThrough>
                        {(allowed) => (
                          <Col className="col-auto">
                            <Link
                              to="/request-appointment"
                              disabled={!allowed}
                              className="icon icon-shape bg-warning text-white text-lg rounded-circle"
                              variant="light"
                            >
                              <span className="material-symbols-outlined">
                                add
                              </span>
                            </Link>
                          </Col>
                        )}
                      </Can>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </>
          ) : (
            loading && <Loader />
          )}
        </Row>
        <br />
        <div className="row row-cols-4 g-2">
          <div className="col">
            <div className="bg-white text-center rounded-4 p-2 shadow-sm">
              <Can I="list" this="Doctor" passThrough>
                {(allowed) => (
                  <a href="/doctors" disabled={!allowed} className="link-dark">
                    <img
                      src="img/home/doctor.png"
                      alt=""
                      className="img-fluid px-2"
                    />
                    <p className="text-truncate small pt-2 m-0">Doctor</p>
                  </a>
                )}
              </Can>
            </div>
          </div>
          <div className="col">
            <div className="bg-white text-center rounded-4 p-2 shadow-sm">
              <Can I="list" this="Appointment" passThrough>
                {(allowed) => (
                  <a
                    href="/appointments"
                    disabled={!allowed}
                    className="link-dark"
                  >
                    <img
                      src="img/home/schedule.png"
                      alt=""
                      className="img-fluid px-2"
                    />
                    <p className="text-truncate small pt-2 m-0">Appointment</p>
                  </a>
                )}
              </Can>
            </div>
          </div>
          <div className="col">
            <div className="bg-white text-center rounded-4 p-2 shadow-sm">
              <Can I="list" this="Invoice" passThrough>
                {(allowed) => (
                  <a href="/invoice" disabled={!allowed} className="link-dark">
                    <img
                      src="img/home/prescription.png"
                      alt=""
                      className="img-fluid px-2"
                    />
                    <p className="text-truncate small pt-2 m-0">Invoice</p>
                  </a>
                )}
              </Can>
            </div>
          </div>
          <div className="col">
            <div className="bg-white text-center rounded-4 p-2 shadow-sm">
              <Can I="list" this="Employee" passThrough>
                {(allowed) => (
                  <a
                    href="/employees"
                    disabled={!allowed}
                    className="link-dark"
                  >
                    <img
                      src="img/home/medicine.png"
                      alt=""
                      className="img-fluid px-2"
                    />
                    <p className="text-truncate small pt-2 m-0">Employee</p>
                  </a>
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
