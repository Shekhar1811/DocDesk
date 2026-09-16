import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import dataServices from "../../apiServices/data.services";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Loader from "../../components/Loader/Loader";
import tokenService from "../../apiServices/token.service";
import { useAlert } from "react-alert";
import Select from "react-select";
import {
  handleValidationError,
  transformPermissions,
} from "./../../components/CommonFunctions";
import { genderOptions } from "../../constants";

const EditProfile = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const token = tokenService.getLocalAccessToken();
  const alert = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getUser()
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data);
        } else {
          alert.error("Failed to fetch patient details");
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    mobile: Yup.string().required("Phone Number is required"),
    date_of_birth: Yup.date().required("Date of Birth is required"),
    gender: Yup.string().required("Gender is required"),
    line1: Yup.string().required("Address Line 1 is required"),
    city: Yup.string().required("City is required"),
    zipcode: Yup.string().required("Postal Code is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: user?.contact?.id,
      first_name: user?.contact?.first_name,
      last_name: user?.contact?.last_name,
      mobile: user?.contact?.mobile,
      date_of_birth: "",
      gender: user?.gender,
      line1: user?.line1,
      city: user?.city,
      zipcode: user?.zipcode,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .updateUser(values.id, values)
        .then((res) => {
          if (res.status === 200) {
            alert.success("Patient details updated successfully");
            const { email, mobile, first_name, last_name, permissions, role } =
              res.data.contact;
            const userData = {
              username: email,
              mobile: mobile,
              role: role,
              name: first_name + " " + last_name,
              token: token,
              clinic: res.data.clinic,
              permissions: transformPermissions(permissions),
            };
            tokenService.setUser(userData);
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
        setLoading(false);
      })
        .finally(() => {
          setLoading(false);
          navigate("/my-profile");
          window.location.reload();
        });
    },
  });
  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-2 pb-1 fw-bold text-black">Edit Profile</h6>
        </div>
      </div>
      {user ? (
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="name-f">First Name</Form.Label>
              <Form.Control
                type="text"
                id="name-f"
                {...formik.getFieldProps("first_name")}
                placeholder="Enter first name"
                isInvalid={
                  formik.touched.first_name && formik.errors.first_name
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.first_name}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="name-l">Last Name</Form.Label>
              <Form.Control
                type="text"
                id="name-l"
                {...formik.getFieldProps("last_name")}
                placeholder="Enter last name"
                isInvalid={formik.touched.last_name && formik.errors.last_name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.last_name}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="tel">Phone</Form.Label>
              <Form.Control
                type="tel"
                id="tel"
                {...formik.getFieldProps("mobile")}
                placeholder="Enter contact number"
                isInvalid={formik.touched.mobile && formik.errors.mobile}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.mobile}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="Date">Date Of Birth</Form.Label>
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
                  formik.touched.date_of_birth && formik.errors.date_of_birth
                    ? "is-invalid"
                    : ""
                }`}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.date_of_birth}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} className="form-group">
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
              <Form.Control.Feedback type="invalid">
                {formik.errors.gender}
              </Form.Control.Feedback>
            </Col>
            <Col sm={6} className="form-group">
              <Form.Label htmlFor="address-1">Address Line-1</Form.Label>
              <Form.Control
                type="text"
                id="address-1"
                {...formik.getFieldProps("line1")}
                placeholder="Locality/House/Street no."
                isInvalid={formik.touched.line1 && formik.errors.line1}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.line1}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="City">City</Form.Label>
              <Form.Control
                type="text"
                id="City"
                {...formik.getFieldProps("city")}
                placeholder="Enter city name"
                isInvalid={formik.touched.city && formik.errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.city}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="zip">Postal Code</Form.Label>
              <Form.Control
                type="text"
                id="zip"
                {...formik.getFieldProps("zipcode")}
                placeholder="Postal code"
                isInvalid={formik.touched.zipcode && formik.errors.zipcode}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.zipcode}
              </Form.Control.Feedback>
            </Col>
          </Row>
          {/* <Row>
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
                  <div className="text-danger">{formik.errors.cnfPassword}</div>
                )}
              </Form.Group>
            </Col>
          </Row> */}
          {/* <small>
          <a href="#"> Change password </a>
        </small> */}
          <div className="footer mt-auto">
            <Button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      ) : (
        loading && <Loader />
      )}
    </div>
  );
};

export default EditProfile;
