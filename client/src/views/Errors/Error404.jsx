import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const Error404 = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-75 py-5 text-center">
      <div className="bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: 480 }}>
        <div className="mb-3 text-primary">
          <span className="material-symbols-outlined" style={{ fontSize: 72 }}>
            error_outline
          </span>
        </div>
        <h1 className="fw-bold text-dark display-6 mb-2">404</h1>
        <h5 className="fw-semibold text-dark mb-3">Page Not Found</h5>
        <p className="text-muted mb-4 small">
          The page or record you are trying to access does not exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" className="px-4 py-2 rounded-pill">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default Error404;