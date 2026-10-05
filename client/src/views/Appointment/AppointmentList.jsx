import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Badge } from "react-bootstrap";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { useAlert } from "react-alert";
import { Link, useSearchParams } from "react-router-dom";
import {
  getInitials,
  handleValidationError,
  showAlert,
} from "../../components/CommonFunctions";
import { Can } from "./../../context/AuthProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment-timezone";

const AppointmentList = ({ status }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rangeParam = searchParams.get("range") || "today";

  const getInitialDays = () => {
    if (rangeParam === "week") return 7;
    if (rangeParam === "month") return 30;
    if (rangeParam === "custom") return null;
    return 1;
  };

  const [appointments, setAppointments] = useState();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(1, "days").format("YYYY-MM-DD")
  );
  const [days, setDays] = useState(getInitialDays());
  const alert = useAlert();

  const getAppointments = (
    start = null,
    end = null,
    d = null,
    st = status
  ) => {
    setLoading(true);
    const apiStatus = st === "ALL" ? null : st;
    dataServices
      .getAppointments(start, end, d, apiStatus)
      .then((res) => {
        if (res.status === 200) {
          setAppointments(res.data);
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
    getAppointments(null, null, days, status);
  }, [days, status]);

  const updateRangeParam = (newDays, rangeLabel) => {
    setDays(newDays);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("range", rangeLabel);
    setSearchParams(newParams, { replace: true });
  };

  const handleDelete = (id) => {
    dataServices.deleteAppointment(id).then((res) => {
      if (res.status === 200) {
        const updatedAppointments = (appointments || []).filter(
          (appointment) => appointment.id !== id
        );
        setAppointments(updatedAppointments);
        alert.success("Appointment deleted successfully");
      } else {
        alert.error("Failed to delete appointment");
      }
    });
  };

  const handleFilter = () => {
    getAppointments(startDate, endDate, null, status);
  };

  const handleClear = () => {
    updateRangeParam(1, "today");
    getAppointments(null, null, 1, status);
  };

  const getStatusBadge = (appStatus) => {
    const s = String(appStatus || "").toUpperCase();
    if (s === "COMPLETED") return <Badge bg="success">Completed</Badge>;
    if (s === "CANCELED" || s === "CANCELLED") return <Badge bg="danger">Canceled</Badge>;
    return <Badge bg="primary">Active</Badge>;
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2">
        <Button
          variant={days === 1 ? "primary" : "outline-primary"}
          onClick={() => updateRangeParam(1, "today")}
          className="me-1 fw-medium"
        >
          Today
        </Button>
        <Button
          variant={days === 7 ? "primary" : "outline-primary"}
          onClick={() => updateRangeParam(7, "week")}
          className="me-1 fw-medium"
        >
          Week
        </Button>
        <Button
          variant={days === 30 ? "primary" : "outline-primary"}
          onClick={() => updateRangeParam(30, "month")}
          className="me-1 fw-medium"
        >
          This Month
        </Button>
        <Button
          variant={days === null ? "primary" : "outline-primary"}
          onClick={() => updateRangeParam(null, "custom")}
          className="me-1 fw-medium"
        >
          Custom
        </Button>
      </div>
      <br />
      {days === null && (
        <Row className="mb-3 align-items-end g-2">
          <Col md={5} xs={6}>
            <Form.Group>
              <Form.Label>Start Date:</Form.Label>
              <DatePicker
                value={startDate ? moment(startDate) : moment(new Date())}
                format="DD-MM-YYYY"
                onChange={(date) =>
                  setStartDate(moment(date).format("YYYY-MM-DD"))
                }
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col md={5} xs={6}>
            <Form.Group>
              <Form.Label>End Date:</Form.Label>
              <DatePicker
                value={
                  endDate ? moment(endDate) : moment(new Date()).add(1, "days")
                }
                format="DD-MM-YYYY"
                minDate={startDate && moment(startDate)}
                onChange={(date) =>
                  setEndDate(moment(date).format("YYYY-MM-DD"))
                }
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col md={2} xs={12} className="d-flex align-items-center action-btn mt-2 mt-md-0">
            <Button
              variant="primary"
              onClick={handleFilter}
              disabled={loading}
              className="filterBtn me-2"
            >
              <span className="material-symbols-outlined">filter_alt</span>
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleClear}
              disabled={loading}
              className="filterBtn"
            >
              Clear
            </Button>
          </Col>
        </Row>
      )}
      <div
        id="pills-upcoming"
        role="tabpanel"
        aria-labelledby="pills-upcoming-tab"
        tabIndex="0"
      >
        {loading ? (
          <Loader fullPage />
        ) : appointments && appointments.length > 0 ? (
          <div className="list">
            {appointments.map((appointment) => {
              const name = appointment.patient?.name || "Patient";
              const initials = getInitials(name);
              return (
                <Can I="read" an="Appointment" passThrough key={appointment.id}>
                  {(allowed) => (
                    <div className="list-item">
                      <Link
                        className="d-flex flex-grow-1 text-decoration-none text-dark"
                        to={`/appointment-details/${appointment.id}`}
                        disabled={!allowed}
                      >
                        <div className="list-item-avtar">
                          <div className="profileImage">{initials}</div>
                        </div>
                        <div className="list-item-content">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <strong className="list-item__name">{name}</strong>
                            {getStatusBadge(appointment.status)}
                          </div>
                          {appointment.details && (
                            <span className="list-item__info d-block">
                              <strong className="text-dark">Note: </strong>
                              {appointment.details}
                            </span>
                          )}
                          <span className="list-item__info d-block text-muted">
                            <span className="mdi mdi-calendar-month text-primary me-1"></span>
                            {appointment.date}, {appointment.time}
                          </span>
                          {appointment.diagnosis && (
                            <span className="list-item__info d-block mt-1">
                              <strong className="text-dark">Diagnosis: </strong>
                              {appointment.diagnosis}
                            </span>
                          )}
                        </div>
                      </Link>
                      <Can I="delete" an="Appointment">
                        <Link
                          to="#"
                          className="delete-icon"
                          onClick={(e) => {
                            e.preventDefault();
                            showAlert(
                              "Appointment",
                              handleDelete,
                              appointment.id
                            );
                          }}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </Link>
                      </Can>
                    </div>
                  )}
                </Can>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm my-3">
            <span className="material-symbols-outlined text-muted display-4 mb-2">event_busy</span>
            <p className="text-muted fw-medium m-0">No appointments found for the selected period.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentList;
