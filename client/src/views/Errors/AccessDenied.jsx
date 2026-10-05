import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const AccessDenied = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-75 py-5 text-center">
      <div className="bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: 480 }}>
        <div className="mb-3 text-danger">
          <span className="material-symbols-outlined" style={{ fontSize: 72 }}>
            gpp_bad
          </span>
        </div>
        <h1 className="fw-bold text-dark display-6 mb-2">403</h1>
        <h5 className="fw-semibold text-dark mb-3">Access Denied</h5>
        <p className="text-muted mb-4 small">
          You do not have permission to view this module. Please contact your clinic administrator for elevated access.
        </p>
        <Link to="/">
          <Button variant="primary" className="px-4 py-2 rounded-pill">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default AccessDenied;