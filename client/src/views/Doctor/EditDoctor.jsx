import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import dataServices from "../../apiServices/data.services";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import Loader from "../../components/Loader/Loader";
import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import { genderOptions } from "../../constants";

const EditDoctor = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getDoctorDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setDoctor(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const formik = useFormik({
    initialValues: {
      contact: {
        first_name: doctor?.contact?.first_name || "",
        last_name: doctor?.contact?.last_name || "",
        email: doctor?.contact?.email || "",
        mobile: doctor?.contact?.mobile || "",
      },
      address: {
        line1: doctor?.address?.line1 || "",
        city: doctor?.address?.city || "",
        zipcode: doctor?.address?.zipcode || "",
      },
      date_of_birth: doctor?.date_of_birth || "",
      date_of_join: doctor?.date_of_join || "",
      gender: doctor?.gender || "",
      password: doctor?.password || "",
      cnfPassword: doctor?.password || "",
    },
    enableReinitialize: true,
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
      /* password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      cnfPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"), */
    }),
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .editDoctor(id, values)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Doctor details updated successfully");
            navigate(`/doctor-profile/${id}`);
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
          <h6 className="mb-2 pb-1 fw-bold text-black">Edit Doctor</h6>
        </div>
      </div>
      <Can I="edit" a="Doctor">
        <Form onSubmit={formik.handleSubmit}>
          {doctor ? (
            <>
              <Row>
                <Col xs={6}>
                  <Form.Group className="form-group" controlId="first_name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("contact.first_name")}
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
                    />
                    {formik.touched.contact?.last_name &&
                      formik.errors.contact?.last_name && (
                        <div className="text-danger">
                          {formik.errors.contact.last_name}
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
                    />
                    {formik.touched.contact?.email &&
                      formik.errors.contact?.email && (
                        <div className="text-danger">
                          {formik.errors.contact.email}
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
                    />
                    {formik.touched.contact?.mobile &&
                      formik.errors.contact?.mobile && (
                        <div className="text-danger">
                          {formik.errors.contact.mobile}
                        </div>
                      )}
                  </Form.Group>
                </Col>
                <Col xs={6} className="form-group">
                  <Form.Label htmlFor="sex">Gender</Form.Label>
                  <Select
                    id="sex"
                    options={genderOptions}
                    value={genderOptions.find(
                      (option) => option.value === formik.values?.gender
                    )}
                    onChange={(option) =>
                      formik.setFieldValue("gender", option.value)
                    }
                    className={formik.errors.gender ? "is-invalid" : ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.gender}
                  </Form.Control.Feedback>
                </Col>
                <Col sm={6}>
                  <Form.Group className="form-group" controlId="line1">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("address.line1")}
                    />
                    {formik.touched.address?.line1 &&
                      formik.errors.address?.line1 && (
                        <div className="text-danger">
                          {formik.errors.address.line1}
                        </div>
                      )}
                  </Form.Group>
                </Col>
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
                  <Form.Group className="form-group" controlId="zipcode">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("address.zipcode")}
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
                      value={moment(formik.values.date_of_birth)}
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
                      value={moment(formik.values.date_of_join)}
                      format="DD-MM-YYYY"
                      maxDate={moment(new Date())}
                      onChange={(date) => {
                        formik.setFieldValue(
                          "date_of_join",
                          date ? moment(date).format("YYYY-MM-DD") : ""
                        );
                      }}
                      className={`form-control ${
                        formik.touched.date_of_join &&
                        formik.errors.date_of_join
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.date_of_join &&
                    formik.errors.date_of_join ? (
                      <div className="invalid-feedback d-block">
                        {formik.errors.date_of_join}
                      </div>
                    ) : null}
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.date_of_join}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
              <Col >
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
                <Col className="footer mt-auto">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  className="w-100"
                >
                  Save Changes
                </Button>
              </Col>
              </Row>
              
            </>
          ) : (
            loading && <Loader />
          )}
        </Form>
      </Can>
    </div>
  );
};

export default EditDoctor;
