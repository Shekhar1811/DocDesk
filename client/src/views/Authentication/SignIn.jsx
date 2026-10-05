import React, { useState } from "react";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import dataServices from "../../apiServices/data.services";
import TokenService from "../../apiServices/token.service";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  handleValidationError,
  transformPermissions,
} from "../../components/CommonFunctions";
import { useAlert } from "react-alert";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const alert = useAlert();
  const from = location.state?.from?.pathname || "/";
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .signIn(values)
        .then((res) => {
          if (res.status === 200) {
            const accessToken = res.data.access_token;
            if (accessToken) {
              TokenService.setUser({
                username: values.email,
              });
              TokenService.updateLocalAccessToken(accessToken);
              getUser(accessToken);
            }
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
          setLoading(false);
        })
        .finally(() => setLoading(false));
    },
  });

  const getUser = (accessToken) => {
    dataServices.getUser()
      .then((res) => {
        if (res.status === 200) {
          const { email, mobile, first_name, last_name, permissions, role } =
            res.data.contact || {};
          const userData = {
            username: email || "",
            mobile: mobile || "",
            role: role || "ADMIN",
            name: `${first_name || ""} ${last_name || ""}`.trim() || email || "User",
            clinic: res.data.clinic || {},
            permissions: transformPermissions(permissions || []),
          };

          const finalizeLogin = (clinicData) => {
            if (clinicData) userData.clinic = clinicData;
            TokenService.setUser(userData);
            TokenService.updateLocalAccessToken(accessToken);
            if (role === "DOCTOR") {
              navigate("/appointments", { replace: true });
            } else {
              navigate(from, { replace: true });
            }
            window.location.reload();
          };

          const clinicId = res.data.clinic?.id;
          if (clinicId) {
            dataServices
              .getClinic(clinicId)
              .then((cRes) => {
                finalizeLogin(cRes.data);
              })
              .catch((err) => {
                console.warn("Could not fetch clinic details, proceeding:", err);
                finalizeLogin(res.data.clinic);
              });
          } else {
            finalizeLogin(res.data.clinic);
          }
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err) || "Failed to retrieve user session. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="bg-primary vh-100 d-flex flex-column">
      <Container className="sign-in p-4">
        <div className="text-center pt-2 pb-2">
          <img
            src="/logo.svg"
            alt="DocDesk - Clinical Practice & Hospital Operations SaaS"
            style={{ maxWidth: "250px", width: "100%", height: "auto" }}
          />
        </div>
        <div className="row align-items-start justify-content-between mb-3">
          <div className="text-white text-center">
            <h2 className="my-2 fw-bold">Welcome Back</h2>
            <p className="text-white-50 mb-0">Sign in to your clinical workspace</p>
          </div>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="exampleFormControlEmail" className="mb-3">
            <div className="mb-1 text-white">Email ID</div>
            <InputGroup className=" py-1">
              <InputGroup.Text
                className=" "
                id="mail"
              >
                <span class="material-symbols-outlined mdi-18px text-muted">mail</span> 
              </InputGroup.Text>
              <Form.Control
                type="email"
                className=" border   "
                placeholder="Type your email"
                aria-label="Type your email"
                aria-describedby="mail"
                style={{
                  borderTopRightRadius: "5px",
                  borderBottomRightRadius: "5px"
                }}
                {...formik.getFieldProps("email")}
                isInvalid={!!formik.errors.email && formik.touched.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="exampleFormControlPassword" className="mb-3">
            <div className="mb-1 text-white ">Password</div>
            <InputGroup className="  py-1">
              <InputGroup.Text
                className=""
                id="password"
              >
               <span class="material-symbols-outlined mdi-18px text-muted">lock</span> 
              </InputGroup.Text>
              <Form.Control
                type="password"
                className="  border  "
                placeholder="Type your password"
                aria-label="Type your password"
                aria-describedby="password"
                style={{
                  borderTopRightRadius: "5px",
                  borderBottomRightRadius: "5px"
                }}
                {...formik.getFieldProps("password")}
                isInvalid={!!formik.errors.password && formik.touched.password}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          {/* <Form.Check
            type="switch"
            id="flexSwitchCheckDefault"
            label="Remember Me"
            className="mb-3"
            {...formik.getFieldProps("rememberMe")}
            checked={formik.values.rememberMe}
          /> */}
          {/* Recruiter Quick Access Card */}
          <div
            className="rounded-3 p-3 my-3 text-start shadow-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-white fw-bold small text-uppercase" style={{ letterSpacing: "0.5px" }}>
                🎯 Recruiter 1-Click Access
              </span>
              <span className="badge bg-warning text-dark px-2 py-1">Instant Demo</span>
            </div>
            <p className="text-white-50 small mb-2" style={{ fontSize: "12px" }}>
              Click either role below to prefill demo credentials:
            </p>
            <div className="d-flex gap-2">
              <Button
                type="button"
                variant="light"
                size="sm"
                className="flex-fill fw-bold text-primary shadow-sm"
                onClick={() => {
                  formik.setFieldValue("email", "admin@docdesk.demo");
                  formik.setFieldValue("password", "Demo@1234");
                }}
              >
                🏥 Admin Demo
              </Button>
              <Button
                type="button"
                variant="outline-light"
                size="sm"
                className="flex-fill fw-bold shadow-sm"
                onClick={() => {
                  formik.setFieldValue("email", "doctor@docdesk.demo");
                  formik.setFieldValue("password", "Demo@1234");
                }}
              >
                🩺 Doctor Demo
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="btn btn-primary btn-lg w-100 mt-2 mb-3"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          {/* <div className="d-flex justify-content-between mt-2">
            <Link
              to="/forget-password"
              className="d-flex justify-content-end small text-primary"
            >
              Forget Password?
            </Link>
          </div> */}
        </Form>
      </Container>
    </div>
  );
}

export default SignIn;
