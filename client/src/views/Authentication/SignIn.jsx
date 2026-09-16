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
    dataServices.getUser().then((res) => {
      if (res.status === 200) {
        const { email, mobile, first_name, last_name, permissions, role } =
          res.data.contact;
        const userData = {
          username: email,
          mobile: mobile,
          role: role,
          name: first_name + " " + last_name,
          clinic: {},
          permissions: transformPermissions(permissions),
        };
        dataServices.getClinic(res.data.clinic.id).then((res) => {
          if (res.status === 200) {
            const clinic = res.data;
            userData.clinic = clinic;
            TokenService.setUser(userData);
            TokenService.updateLocalAccessToken(accessToken);
            if (role === "DOCTOR") {
              navigate("/appointments", { replace: true });
            } else {
              navigate(from, { replace: true });
            }
            window.location.reload();
          }
        });
      }
    });
  };

  return (
    <div className="bg-primary vh-100 d-flex flex-column">
      <Container className="sign-in p-4">
      <br />
    <div className="text-center"> <img src="/logo.svg" width={'200'} alt="" /></div> 
      <br /> <br />
        <div className="row align-items-start justify-content-between mb-4">
         
        
          <div className="text-white text-center  ">
            <span className="mdi mdi-account-circle-outline display-1 text-primary"></span>
            <h2 className="my-3 fw-bold">Welcome</h2>
            <p className="  mb-0">
            Sign in to Continue 
            </p>
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
          <Button
            type="submit"
            className="btn btn-primary btn-lg w-100 mt-3 mb-3"
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
