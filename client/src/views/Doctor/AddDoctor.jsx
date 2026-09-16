import React, { useState } from "react";
import { useFormik } from "formik";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import dataServices from "../../apiServices/data.services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import moment from "moment-timezone";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Can } from "../../context/AuthProvider";
import { useAlert } from "react-alert";
import { handleValidationError } from "../../components/CommonFunctions";
import { genderOptions } from "../../constants";

const AddDoctor = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      code: "123",
      date_of_birth: "",
      date_of_join: "",
      qualification: "MCM",
      status: "ACTIVE",
      contact: {
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
      },
      gender: "",
      password: "",
      cnfPassword: "",
      address: {
        line1: "",
        line2: "test",
        state: "test",
        city: "",
        zipcode: "",
      },
    },
    validationSchema: Yup.object({
      contact: Yup.object().shape({
        first_name: Yup.string().required("First Name is required"),
        last_name: Yup.string().required("Last Name is required"),
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
        mobile: Yup.string().required("Mobile Number is required"),
      }),
      address: Yup.object().shape({
        // line1: Yup.string().required("Address Line 1 is required"),
        // line2: Yup.string().required("Address Line 2 is required"),
        city: Yup.string().required("City is required"),
        // state: Yup.string().required("State is required"),
        // zipcode: Yup.string().required("Zip Code is required"),
      }),
      // date_of_birth: Yup.date().required("Date of Birth is required"),
      // date_of_join: Yup.date().required("Date of Joining is required"),
      gender: Yup.string().required("Gender is required"),
      // qualification: Yup.string().required("Qualification is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      cnfPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .addDoctor(values)
        .then((res) => {
          if (res.status === 201) {
            toast.success("Employee added successfully");
            console.log("Employee added successfully");
            navigate("/doctors");
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
          setLoading(false);
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-2 pb-1 fw-bold text-black">Add Doctor</h6>
        </div>
      </div>
      <Can I="add" a="Doctor">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col xs={6}>
              <Form.Group className="form-group" controlId="first_name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("contact.first_name")}
                  isInvalid={
                    formik.touched.contact?.first_name &&
                    formik.errors.contact?.first_name
                  }
                />
                {formik.touched.contact?.first_name &&
                  formik.errors.contact?.first_name && (
                    <div className="text-danger">
                      {formik.errors.contact.first_name}
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="form-group" controlId="last_name">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("contact.last_name")}
                  isInvalid={
                    formik.touched.contact?.last_name &&
                    formik.errors.contact?.last_name
                  }
                />
                {formik.touched.contact?.last_name &&
                  formik.errors.contact?.last_name && (
                    <div className="text-danger">
                      {formik.errors.contact?.last_name}
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="form-group" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  {...formik.getFieldProps("contact.email")}
                  isInvalid={
                    formik.touched.contact?.email &&
                    formik.errors.contact?.mobile
                  }
                />
                {formik.touched.contact?.email &&
                  formik.errors.contact?.email && (
                    <div className="text-danger">
                      {formik.errors.contact?.email}
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="form-group" controlId="mobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="tel"
                  {...formik.getFieldProps("contact.mobile")}
                  isInvalid={
                    formik.touched.contact?.mobile &&
                    formik.errors.contact?.mobile
                  }
                />
                {formik.touched.contact?.mobile &&
                  formik.errors.contact?.mobile && (
                    <div className="text-danger">
                      {formik.errors.contact?.mobile}
                    </div>
                  )}
              </Form.Group>
            </Col>
            {/*  <Col xs={6} className="form-group">
            <Form.Label htmlFor="sex">Gender</Form.Label>
            <Select
              id="sex"
              options={genderOptions}
              value={genderOptions.find(
                (option) => option.value === formik.values.gender
              )}
              onChange={(option) =>
                formik.setFieldValue("gender", option.value)
              }
              className={formik.errors.gender ? "is-invalid" : ""}
            />
            <Form.Control.Feedback type="invalid">
              {formik.touched.gender && formik.errors.gender}
            </Form.Control.Feedback>
          </Col> */}
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="sex">Gender</Form.Label>
              <Select
                id="sex"
                options={genderOptions}
                value={genderOptions.find(
                  (option) => option.value === formik.values.gender
                )}
                onChange={(option) =>
                  formik.setFieldValue("gender", option.value)
                }
                className={
                  formik.touched.gender && formik.errors.gender
                    ? "is-invalid"
                    : ""
                }
              />
              {formik.touched.gender && formik.errors.gender && (
                <div className="invalid-feedback d-block">
                  {formik.errors.gender}
                </div>
              )}
            </Col>
            <Col sm={6}>
              <Form.Group className="form-group" controlId="line1">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("address.line1")}
                  isInvalid={
                    formik.touched.address?.line1 &&
                    formik.errors.address?.line1
                  }
                />
                {formik.touched.address?.line1 &&
                  formik.errors.address?.line1 && (
                    <div className="text-danger">
                      {formik.errors.address.line1}
                    </div>
                  )}
              </Form.Group>
            </Col>
            {/* <Col xs={6}>
            <Form.Group  className="form-group"  controlId="line2">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps("address.line2")}
              />
              {formik.touched.address?.line2 &&
                formik.errors.address?.line2 && (
                  <div className="text-danger">
                    {formik.errors.address.line2}
                  </div>
                )}
            </Form.Group>
          </Col> */}
            {/* <Col xs={6}>
            <Form.Group  className="form-group"  controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps("address.state")}
              />
              {formik.touched.address?.state &&
                formik.errors.address?.state && (
                  <div className="text-danger">
                    {formik.errors.address.state}
                  </div>
                )}
            </Form.Group>
          </Col> */}
            <Col xs={6}>
              <Form.Group className="form-group" controlId="address.city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your city"
                  {...formik.getFieldProps("address.city")}
                  isInvalid={
                    formik.touched.address?.city && formik.errors.address?.city
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address?.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group className="form-group" controlId="zipcode">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("address.zipcode")}
                  isInvalid={
                    formik.touched.address?.zipcode &&
                    formik.errors.address?.zipcode
                  }
                />
                {formik.touched.address?.zipcode &&
                  formik.errors.address?.zipcode && (
                    <div className="text-danger">
                      {formik.errors.address.zipcode}
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="form-group" controlId="date_of_birth">
                <Form.Label>Date of Birth</Form.Label>
                {/* <DatePicker
                name="date_of_birth"
                maxDate={new Date()}
                selected={
                  formik.values.date
                    ? moment(formik.values.date, "YYYY-MM-DD").toDate()
                    : new Date()
                }
                onChange={(date) => {
                  formik.setFieldValue(
                    "date_of_birth",
                    date ? moment(date).format("YYYY-MM-DD") : ""
                  );
                }}
                dateFormat="yyyy-MM-dd"
                className={`form-control ${
                  formik.touched.date_of_birth && formik.errors.date_of_birth
                    ? "is-invalid"
                    : ""
                }`}
              /> */}
                <DatePicker
                  name="date_of_birth"
                  value={moment(formik.values?.date_of_birth)}
                  format="DD-MM-YYYY"
                  maxDate={moment(new Date())}
                  onChange={(date) => {
                    formik.setFieldValue(
                      "date_of_birth",
                      date ? moment(date).format("YYYY-MM-DD") : ""
                    );
                  }}
                  className={`form-control ${
                    formik.touched.date_of_birth && formik.errors.date_of_birth
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.date_of_birth && formik.errors.date_of_birth ? (
                  <div className="invalid-feedback d-block">
                    {formik.errors.date_of_birth}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="form-group" controlId="date_of_join">
                <Form.Label>Date of Join</Form.Label>
                <DatePicker
                  name="date_of_join"
                  value={moment(formik.values?.date_of_join)}
                  format="DD-MM-YYYY"
                  maxDate={moment(new Date())}
                  onChange={(date) => {
                    formik.setFieldValue(
                      "date_of_join",
                      date ? moment(date).format("YYYY-MM-DD") : ""
                    );
                  }}
                  className={`form-control ${
                    formik.touched.date_of_join && formik.errors.date_of_join
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.date_of_join && formik.errors.date_of_join ? (
                  <div className="invalid-feedback d-block">
                    {formik.errors.date_of_join}
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group className="form-group" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  {...formik.getFieldProps("password")}
                  isInvalid={formik.touched.password && formik.errors.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger">{formik.errors.password}</div>
                )}
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="form-group" controlId="cnfPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  {...formik.getFieldProps("cnfPassword")}
                  isInvalid={
                    formik.touched.cnfPassword && formik.errors.cnfPassword
                  }
                />
                {formik.touched.cnfPassword && formik.errors.cnfPassword && (
                  <div className="text-danger">{formik.errors.cnfPassword}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <div className="footer mt-auto">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-100"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Can>
    </div>
  );
};

export default AddDoctor;
