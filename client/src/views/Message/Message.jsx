import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Message = () => {
  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-2 pb-1 fw-bold text-black">Clinic Messages</h6>
      </div>
      <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
        <div className="mb-3 text-primary">
          <span className="material-symbols-outlined" style={{ fontSize: 56 }}>
            forum
          </span>
        </div>
        <h5 className="fw-bold mb-2">No Active Conversations</h5>
        <p className="text-muted small mb-4" style={{ maxWidth: 400, margin: "0 auto" }}>
          Direct messaging with patients and staff members is enabled via WhatsApp automation from the invoice and appointment views.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/patients" className="btn btn-primary rounded-pill px-4">
            View Patients
          </Link>
          <Link to="/appointments" className="btn btn-outline-primary rounded-pill px-4">
            Appointments
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Message;