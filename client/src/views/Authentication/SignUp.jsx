import React from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import dataServices from "../../apiServices/data.services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "singh@email.com",
      name: "Singh",
      password: "123456789",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      name: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      dataServices.signUp(values).then((res) => {
        console.log(res);
        if (res.status == 201) {
          toast.success("New user added successfully");
          navigate("/sign-in");
        } else {
          toast.error("There was an error while registering. Please try again");
        }
      });
    },
  });

  return (
    <Container className="bg-light p-4">
      <div className="sign-in">
        <div className="d-flex align-items-start justify-content-between mb-4">
          <div>
            <span className="mdi mdi-account-plus-outline display-1 text-primary"></span>
            <h2 className="my-3 fw-bold">Getting Started</h2>
            <p className="text-muted mb-0">Create an account to continue!</p>
          </div>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="exampleFormControlEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <InputGroup className="border bg-white rounded-3 py-1">
              <InputGroup.Text className="bg-transparent rounded-0 border-0">
                <span className="mdi mdi-email-outline mdi-18px text-muted"></span>
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Type your email or phone"
                aria-label="Type your email or phone"
                {...formik.getFieldProps("email")}
              />
            </InputGroup>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-danger">{formik.errors.email}</div>
            ) : null}
          </Form.Group>

          <Form.Group controlId="exampleFormControlName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <InputGroup className="border bg-white rounded-3 py-1">
              <InputGroup.Text className="bg-transparent rounded-0 border-0">
                <span className="mdi mdi-account-circle-outline mdi-18px text-muted"></span>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Type your name"
                aria-label="Type your name"
                {...formik.getFieldProps("name")}
              />
            </InputGroup>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-danger">{formik.errors.name}</div>
            ) : null}
          </Form.Group>

          <Form.Group controlId="exampleFormControlPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup className="border bg-white rounded-3 py-1">
              <InputGroup.Text className="bg-transparent rounded-0 border-0">
                <span className="mdi mdi-lock-outline mdi-18px text-muted"></span>
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Type your password"
                aria-label="Type your password"
                {...formik.getFieldProps("password")}
              />
            </InputGroup>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger">{formik.errors.password}</div>
            ) : null}
          </Form.Group>

          <Form.Group controlId="flexSwitchCheckDefault" className="mb-3">
            <Form.Check
              type="switch"
              label="Remember Me"
              // {...formik.getFieldProps("rememberMe")}
            />
          </Form.Group>

          <Button
            type="submit"
            className="btn btn-primary w-100 rounded-4 mb-3"
          >
            Create Account
          </Button>
          <p className="text-muted text-center small">
            Already have an account?{" "}
            <a className="text-primary" href="/sign-in">
              Sign In
            </a>
          </p>
        </Form>
      </div>

      <div className="footer fixed-bottom m-4">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <hr className="col" />
          <span>Or Continue With</span>
          <hr className="col" />
        </div>
        <Row className="d-flex gap-2">
          <Button
            variant="white"
            className="btn-lg col d-flex align-items-center justify-content-center shadow-sm border"
          >
            <i className="bi bi-google h4 mb-0 me-3"></i>Google
          </Button>
          <Button
            variant="white"
            className="btn-lg col d-flex align-items-center justify-content-center shadow-sm border"
          >
            <i className="bi bi-apple h4 mb-0 me-3"></i>Apple
          </Button>
        </Row>
      </div>
    </Container>
  );
};

export default SignUp;
