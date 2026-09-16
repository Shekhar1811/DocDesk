import React from "react";
import { Row, Col, Button, Tab, Tabs } from "react-bootstrap";
import { Can } from "./../../context/AuthProvider";
import AppointmentList from "./AppointmentList";

const Appointment = () => {
  return (
    <div className="content-wrapper">
      <Row className="d-flex justify-content-between align-items-center mt-3 mb-3">
        <Col>
          <h6 className="mb-2 pb-1  fw-bold text-black">Appointment</h6>
        </Col>
        <Col className="text-end">
          <Can I="add" an="Appointment">
            <Button href="/request-appointment" variant="primary">
              Add Appointment
            </Button>
          </Can>
        </Col>
        <br />
        <Can I="list" an="Appointment">
          <Tabs
            defaultActiveKey="todayAppointments"
            id="#"
            className="mb-3 mt-3"
            mountOnEnter={true}
          >
            <Tab eventKey="todayAppointments" title="Active">
              <AppointmentList status="ACTIVE" />
            </Tab>
            <Tab eventKey="comAppointments" title="Completed">
              <AppointmentList status="COMPLETED" />
            </Tab>
            <Tab eventKey="canAppointments" title="Canceled">
              <AppointmentList status="CANCELED" />
            </Tab>
          </Tabs>
        </Can>
      </Row>
    </div>
  );
};

export default Appointment;
