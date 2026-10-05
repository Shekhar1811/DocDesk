import React from "react";
import { Row, Col, Tab, Tabs } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { Can } from "./../../context/AuthProvider";
import AppointmentList from "./AppointmentList";

const Appointment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";

  const handleTabSelect = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", key);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div className="content-wrapper">
      <Row className="d-flex justify-content-between align-items-center mt-3 mb-3">
        <Col>
          <h6 className="mb-2 pb-1 fw-bold text-black">Appointments</h6>
        </Col>
        <Col className="text-end">
          <Can I="add" an="Appointment">
            <Link to="/request-appointment" className="btn btn-primary">
              Add Appointment
            </Link>
          </Can>
        </Col>
        <br />
        <Can I="list" an="Appointment">
          <Tabs
            activeKey={currentTab}
            onSelect={handleTabSelect}
            id="appointment-tabs"
            className="mb-3 mt-3"
            mountOnEnter={true}
            unmountOnExit={false}
          >
            <Tab eventKey="all" title="All">
              <AppointmentList status="ALL" />
            </Tab>
            <Tab eventKey="active" title="Active">
              <AppointmentList status="ACTIVE" />
            </Tab>
            <Tab eventKey="completed" title="Completed">
              <AppointmentList status="COMPLETED" />
            </Tab>
            <Tab eventKey="canceled" title="Canceled">
              <AppointmentList status="CANCELED" />
            </Tab>
          </Tabs>
        </Can>
      </Row>
    </div>
  );
};

export default Appointment;
