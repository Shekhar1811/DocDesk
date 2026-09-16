import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import {
  getInitials,
  handleValidationError,
  showAlert,
} from "../../components/CommonFunctions";
import { Can } from "./../../context/AuthProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment-timezone";

const AppointmentList = ({ status }) => {
  const [appointments, setAppointments] = useState();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(1, "days").format("YYYY-MM-DD")
  );
  const [days, setDays] = useState(1);
  const alert = useAlert();
  const getAppointments = (
    startDate = null,
    endDate = null,
    days = null,
    status
  ) => {
    setLoading(true);
    dataServices
      .getAppointments(startDate, endDate, days, status)
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

  const handleDelete = (id) => {
    // Add your delete logic here
    dataServices.deleteAppointment(id).then((res) => {
      if (res.status === 200) {
        const updatedAppointments = appointments.filter(
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
    setDays(1);
    getAppointments(null, null, 1, status);
  };
  return (
    <>
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
        <div>
          <Button
            variant="outline-primary"
            onClick={() => setDays(null)}
            className={`me-1 ${days === null && "active"} `}
          >
            Custom
          </Button>
        </div>
      </div>
      <br />
      {days === null && (
        <Row className="mb-3 align-items-end">
          <Col xs={6}>
            <Form.Group>
              <Form.Label>Start Date:</Form.Label>
              <DatePicker
                name="dob"
                value={startDate ? moment(startDate) : moment(new Date())}
                format="DD-MM-YYYY"
                onChange={(date) =>
                  setStartDate(moment(date).format("YYYY-MM-DD"))
                }
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col xs={6}>
            <Form.Group>
              <Form.Label>End Date:</Form.Label>
              <DatePicker
                name="dob"
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
          <Col xs={2} className="d-flex align-items-center action-btn">
            <Button
              variant="outline-primary "
              onClick={handleFilter}
              disabled={loading}
              className="filterBtn me-2"
            >
              <span className="material-symbols-outlined">filter_alt</span>
            </Button>
            <Button
              variant="outline-primary"
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
        {appointments ? (
          <div className="list">
            {appointments.toReversed().map((appointment, index) => {
              const name = appointment.patient?.name;
              const initials = getInitials(name);
              return (
                <Can I="read" an="Appointment" passThrough key={index}>
                  {(allowed) => (
                    <div className="list-item">
                      <a
                        className="d-flex"
                        href={`/appointment-details/${appointment.id}`}
                        disabled={!allowed}
                        key={index}
                      >
                        <div className="list-item-avtar">
                          <div className="profileImage">{initials}</div>
                        </div>
                        <div className="list-item-content">
                          <strong className="list-item__name"> {name}</strong>
                          <span className="list-item__info">
                            <strong className="text-dark">Note: </strong>
                            {appointment.details}
                          </span>
                          <br />
                          <span className="list-item__info">
                            <span className="mdi mdi-calendar-month text-primary me-1"></span>
                            {appointment.date}, {appointment.time}
                          </span>
                          <br />
                          {appointment.diagnosis && (
                            <span className="list-item__info">
                              <strong className="text-dark">Diagnosis:</strong>
                              {appointment.diagnosis}
                            </span>
                          )}
                        </div>
                      </a>
                      <Can I="delete" an="Appointment">
                        <Link
                          className="delete-icon"
                          onClick={() =>
                            showAlert(
                              "Appointment",
                              handleDelete,
                              appointment.id
                            )
                          }
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
          loading && <Loader />
        )}
      </div>
    </>
  );
};

export default AppointmentList;
