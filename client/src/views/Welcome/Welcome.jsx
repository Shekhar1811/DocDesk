import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="content-wrapper">
      <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-primary text-white">
        <Row className="align-items-center">
          <Col md={8}>
            <h2 className="fw-bold mb-2">Welcome to DocDesk</h2>
            <p className="lead mb-4 opacity-75">
              Smart Clinic & Hospital Management SaaS. Efficiently manage appointments, patient records, clinical assessments, and invoices with 1-click workflows.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/">
                <Button variant="light" className="text-primary fw-semibold px-4 rounded-pill">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/appointments">
                <Button variant="outline-light" className="px-4 rounded-pill">
                  Appointments
                </Button>
              </Link>
            </div>
          </Col>
          <Col md={4} className="text-center d-none d-md-block">
            <span className="material-symbols-outlined" style={{ fontSize: 120, opacity: 0.9 }}>
              medical_services
            </span>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Welcome;