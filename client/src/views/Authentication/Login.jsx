import React from "react";
import { Container } from "react-bootstrap";

const Login = () => {
  return (
    <div className="bg-primary vh-100 d-flex flex-column">
      <Container className="index d-flex align-items-center justify-content-center flex-grow-1">
        <div className="text-center p-3">
          <div className="mb-5 pb-5">
            <a href="/sign-in" className="gap-2 text-white text-center text-decoration-none">
              <div className="rounded-pill bg-white p-3 d-inline-block mb-3 shadow-sm">
                <img src="/img/logo.svg" alt="DocDesk" className="img-fluid logo" style={{ width: "56px", height: "56px" }} />
              </div>
              <h1 className="mb-1 fw-bold">DocDesk</h1>
              <p className="text-white-50 small mb-0">Smart Clinic & Hospital Management</p>
            </a>
          </div>
        </div>
      </Container>
      <footer className="footer p-3">
        <a href="/sign-in" className="btn btn-secondary btn-lg w-100">
          Click Here
        </a>
      </footer>
    </div>
  );
};

export default Login;
