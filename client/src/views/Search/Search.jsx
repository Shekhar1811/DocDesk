import React, { useState } from "react";
import { Card, Form, InputGroup, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/patients`);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-2 pb-1 fw-bold text-black">Clinic Global Search</h6>
      </div>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
        <Form onSubmit={handleSearch}>
          <InputGroup className="bg-light rounded-pill p-1 border">
            <InputGroup.Text className="bg-transparent border-0 ps-3">
              <span className="material-symbols-outlined text-muted">search</span>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search patients, doctors, appointments, or invoices..."
              className="bg-transparent border-0 shadow-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary rounded-pill px-4">
              Search
            </button>
          </InputGroup>
        </Form>
      </Card>

      <Row className="g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 text-center h-100">
            <span className="material-symbols-outlined text-primary fs-1 mb-2">personal_injury</span>
            <h6 className="fw-semibold">Find Patients</h6>
            <p className="text-muted small mb-3">Look up medical histories, contact details, and assigned packages.</p>
            <Link to="/patients" className="btn btn-sm btn-outline-primary rounded-pill mt-auto">
              Open Patients
            </Link>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 text-center h-100">
            <span className="material-symbols-outlined text-success fs-1 mb-2">calendar_month</span>
            <h6 className="fw-semibold">Appointments</h6>
            <p className="text-muted small mb-3">Search active bookings, scheduled visits, and clinical notes.</p>
            <Link to="/appointments" className="btn btn-sm btn-outline-success rounded-pill mt-auto">
              Open Appointments
            </Link>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 text-center h-100">
            <span className="material-symbols-outlined text-warning fs-1 mb-2">receipt_long</span>
            <h6 className="fw-semibold">Billing & Invoices</h6>
            <p className="text-muted small mb-3">Look up paid and pending clinic invoices and receipts.</p>
            <Link to="/invoice" className="btn btn-sm btn-outline-warning rounded-pill mt-auto">
              Open Invoices
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Search;