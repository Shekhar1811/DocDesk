import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col } from "react-bootstrap";
import dataServices from "../../apiServices/data.services";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import moment from "moment-timezone";
import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Can } from "./../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import { genderOptions } from "../../constants";

const EditEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getEmployeeDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setEmployee(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const validationSchema = Yup.object().shape({
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
    // date_of_join: Yup.date().required("Date of Join is required"),
    designation: Yup.string().required("Designation is required"),
    // qualification: Yup.string().required("Qualification is required"),
    /* password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      cnfPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"), */
  });

  const formik = useFormik({
    initialValues: {
      contact: {
        first_name: employee?.contact?.first_name || "",
        last_name: employee?.contact?.last_name || "",
        email: employee?.contact?.email || "",
        mobile: employee?.contact?.mobile || "",
      },
      address: {
        line1: employee?.address?.line1 || "",
        city: employee?.address?.city || "",
        zipcode: employee?.address?.zipcode || "",
      },
      date_of_birth: employee?.date_of_birth || new Date(),
      date_of_join: employee?.date_of_join || new Date(),
      designation: employee?.designation || "",
      gender: employee?.gender || "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      // handle form submission
      setLoading(true);
      dataServices
        .editEmployee(id, values)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Employee details updated successfully");
            navigate(`/employee-profile/${id}`);
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
          <h6 className="mb-2 pb-1  fw-bold text-black">Edit Employee</h6>
        </div>
      </div>

      <Form onSubmit={formik.handleSubmit}>
        {employee ? (
          <>
            <Row>
              <Col xs={6}>
                <Form.Group
                  className="form-group"
                  controlId="contact.first_name"
                >
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    {...formik.getFieldProps("contact.first_name")}
                    isInvalid={
                      formik.touched.contact?.first_name &&
                      formik.errors.contact?.first_name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.contact?.first_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group
                  className="form-group"
                  controlId="contact.last_name"
                >
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    {...formik.getFieldProps("contact.last_name")}
                    isInvalid={
                      formik.touched.contact?.last_name &&
                      formik.errors.contact?.last_name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.contact?.last_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="form-group" controlId="contact.email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    {...formik.getFieldProps("contact.email")}
                    isInvalid={
                      formik.touched.contact?.email &&
                      formik.errors.contact?.email
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.contact?.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="form-group" controlId="contact.mobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your mobile number"
                    {...formik.getFieldProps("contact.mobile")}
                    isInvalid={
                      formik.touched.contact?.mobile &&
                      formik.errors.contact?.mobile
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.contact?.mobile}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="form-group">
                  <Form.Label htmlFor="gender">Gender</Form.Label>
                  <Select
                    id="gender"
                    name="gender"
                    options={genderOptions}
                    value={genderOptions.find(
                      (option) => option.value === formik.values?.gender
                    )}
                    onChange={(selectedOption) => {
                      formik.setFieldValue("gender", selectedOption.value);
                    }}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.gender && formik.errors.gender
                        ? "is-invalid"
                        : ""
                    }
                    placeholder="Select Gender"
                  />
                  {formik.touched.gender && formik.errors.gender ? (
                    <div className="invalid-feedback d-block">
                      {formik.errors.gender}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="form-group" controlId="designation">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter  designation"
                    {...formik.getFieldProps("designation")}
                    isInvalid={
                      formik.touched.designation && formik.errors.designation
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.designation}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="form-group" controlId="address.line1">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address line 1"
                    {...formik.getFieldProps("address.line1")}
                    isInvalid={
                      formik.touched.address?.line1 &&
                      formik.errors.address?.line1
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address?.line1}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="form-group" controlId="address.city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your city"
                    {...formik.getFieldProps("address.city")}
                    isInvalid={
                      formik.touched.address?.city &&
                      formik.errors.address?.city
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address?.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="form-group" controlId="address.zipcode">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter  zip code"
                    {...formik.getFieldProps("address.zipcode")}
                    isInvalid={
                      formik.touched.address?.zipcode &&
                      formik.errors.address?.zipcode
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address?.zipcode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="form-group" controlId="date_of_birth">
                  <Form.Label>Date of Birth</Form.Label>
                  {/* <DatePicker
                    name="date_of_birth"
                    maxDate={new Date()}
                    selected={
                      formik.values?.date_of_birth
                        ? moment(
                            formik.values.date_of_birth,
                            "YYYY-MM-DD"
                          ).toDate()
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
                      formik.touched.date_of_birth &&
                      formik.errors.date_of_birth
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
                      formik.touched.date_of_birth &&
                      formik.errors.date_of_birth
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.date_of_birth &&
                  formik.errors.date_of_birth ? (
                    <div className="invalid-feedback d-block">
                      {formik.errors.date_of_birth}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="form-group" controlId="date_of_join">
                  <Form.Label>Date of Join</Form.Label>
                  {/* <DatePicker
                    name="date_of_join"
                    maxDate={new Date()}
                    selected={
                      formik.values?.date_of_join
                        ? moment(
                            formik.values.date_of_join,
                            "YYYY-MM-DD"
                          ).toDate()
                        : new Date()
                    }
                    onChange={(date) => {
                      formik.setFieldValue(
                        "date_of_join",
                        date ? moment(date).format("YYYY-MM-DD") : ""
                      );
                    }}
                    dateFormat="yyyy-MM-dd"
                    className={`form-control ${
                      formik.touched.date_of_join && formik.errors.date_of_join
                        ? "is-invalid"
                        : ""
                    }`}
                  /> */}
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
            </Row>
            {/*  <Row>
              <Col xs={6}>
                <Form.Group className="form-group" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    {...formik.getFieldProps("password")}
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
                  />
                  {formik.touched.cnfPassword && formik.errors.cnfPassword && (
                    <div className="text-danger">
                      {formik.errors.cnfPassword}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row> */}
            <Can I="edit" an="Employee">
              <Row>
              <Col className="footer mt-auto">
                <Button 
                    type="button" 
                    className="btn btn-primary w-100" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.back();
                    }}
                  >
                    Cancel
                  </Button>
              </Col> 
              <Col className="footer mt-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100"
                >
                  Save Changes
                </Button>
              </Col> 
              </Row> 
            </Can>
          </>
        ) : (
          loading && <Loader />
        )}
      </Form>
    </div>
  );
};

export default EditEmployee;
