import React from "react";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Notification = () => {
  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-2 pb-1 fw-bold text-black">Notifications</h6>
      </div>
      <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
        <div className="mb-3 text-primary">
          <span className="material-symbols-outlined" style={{ fontSize: 56 }}>
            notifications_active
          </span>
        </div>
        <h5 className="fw-bold mb-2">You're All Caught Up!</h5>
        <p className="text-muted small mb-4" style={{ maxWidth: 380, margin: "0 auto" }}>
          No pending clinic alerts or urgent patient reminders at this time. New appointment bookings and invoice payments will appear here.
        </p>
        <div>
          <Link to="/appointments" className="btn btn-outline-primary rounded-pill px-4">
            View Schedule
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Notification;