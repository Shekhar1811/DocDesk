import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import dataServices from "../../apiServices/data.services";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import moment from "moment-timezone";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import { genderOptions } from "../../constants";
import { Typeahead } from "react-bootstrap-typeahead";

const AddPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const alert = useAlert();

  useEffect(() => {
    dataServices.getPackages().then((res) => {
      if (res.status === 200) {
        const options = res.data.map((pkg) => ({
          value: pkg.id,
          label: pkg.name,
          amount: pkg.amount,
        }));
        setPackages(options);
      }
    });
    dataServices
      .getPatientsSlim("?lk=true")
      .then((res) => {
        if (res.status === 200) {
          const result = res.data;
          setPatients(result);
          const options = result.map((patient) => ({
            value: patient.id,
            label: patient.name,
          }));
          setPatientOptions(options);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    contact: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      mobile: Yup.string().required("Phone Number is required"),
    }),
    /* package: Yup.object().shape({
      id: Yup.number().required("Please select a package"),
      amount: Yup.number().required(),
      name: Yup.string().required(),
    }), */
    // date_of_birth: Yup.date().required("Date of Birth is required"),
    registration_date: Yup.date().required("Registration date is required"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.object().shape({
      // line1: Yup.string().required("Address Line 1 is required"),
      city: Yup.string().required("City is required"),
      // zipcode: Yup.string().required("Postal Code is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      description: "test",
      status: "Active",
      contact: {
        name: "",
        mobile: "",
      },
      registration_date: moment(new Date()).format("YYYY-MM-DD"),
      package_start_date: null,
      package_end_date: null,
      date_of_birth: null,
      package_id: null,
      gender: "",
      address: {
        line1: "",
        city: "",
        zipcode: "",
      },
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!checkIfPatientExists(values.contact.name)) {
        setLoading(true);
        dataServices
          .addPatients(values)
          .then((res) => {
            if (res.status === 201) {
              alert.success("Patient added successfully");
              navigate("/patients");
            }
          })
          .catch((err) => {
            alert.error(handleValidationError(err));
            setLoading(false);
          })
          .finally(() => setLoading(false));
      }
    },
  });

  const checkIfPatientExists = (name) => {
    const existingPatient = patients.find(
      (patient) => patient.name.toLowerCase() === name.toLowerCase()
    );
    if (existingPatient) {
      alert.error("Patient already exists with the same name.");
      return true; // true means patient exists
    }
    return false;
  };

  return (
    <div className="content-wrapper">
      {/* <NameSelect /> */}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-2 pb-1 fw-bold text-black">Add Patients</h6>
        </div>
      </div>
      <Can I="add" a="Patient">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            {/* <Col xs={12} className="form-group">
              <Form.Label htmlFor="name-f">Name</Form.Label>
              <Form.Control
                type="text"
                id="name-f"
                {...formik.getFieldProps("contact.name")}
                placeholder="Enter First Name."
                onBlur={(e) => checkIfPatientExists(e.target.value)}
                isInvalid={
                  formik.touched.contact?.name && formik.errors.contact?.name
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.contact?.name}
              </Form.Control.Feedback>
            </Col> */}
            <Col xs={12} className="form-group">
              <Form.Label htmlFor="name">Name</Form.Label>
              <Typeahead
                id="name"
                onChange={(selected) => {
                  if (selected.length > 0) {
                    formik.setFieldValue("contact.name", selected[0]);
                  }
                }}
                options={patientOptions.map((patient) => patient.label)}
                placeholder="Select or type a name"
                onBlur={(e) => {
                  if (!checkIfPatientExists(e.target.value)) {
                    formik.setFieldValue("contact.name", e.target.value);
                  }
                }}
                isInvalid={
                  formik.touched.contact?.name && !!formik.errors.contact?.name
                }
              />
              {formik.touched.contact?.name && formik.errors.contact?.name && (
                <div className="invalid-feedback">
                  {formik.errors.contact.name}
                </div>
              )}
            </Col>

            <Col xs={6} className="form-group">
              <Form.Label htmlFor="tel">Phone</Form.Label>
              <Form.Control
                type="tel"
                id="tel"
                {...formik.getFieldProps("contact.mobile")}
                placeholder="Enter Contact Number."
                isInvalid={
                  formik.touched.contact?.mobile &&
                  formik.errors.contact?.mobile
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.contact?.mobile}
              </Form.Control.Feedback>
            </Col> 

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
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="Date">Registration Date </Form.Label>
              <DatePicker
                name="registration_date"
                value={moment(formik.values?.registration_date)}
                format="DD-MM-YYYY"
                maxDate={moment(new Date())}
                onChange={(date) => {
                  formik.setFieldValue(
                    "registration_date",
                    date ? moment(date).format("YYYY-MM-DD") : ""
                  );
                }}
                className={`form-control ${
                  formik.touched.registration_date &&
                  formik.errors.registration_date
                    ? "is-invalid"
                    : ""
                }`}
              />
              {formik.touched.registration_date &&
              formik.errors.registration_date ? (
                <div className="invalid-feedback d-block">
                  {formik.errors.registration_date}
                </div>
              ) : null}
            </Col>

            <Col xs={6} className="form-group">
              <Form.Label htmlFor="Date">Date Of Birth</Form.Label>
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
            </Col>

            <Col sm={6} className="form-group">
              <Form.Label htmlFor="address-1">Address Line-1</Form.Label>
              <Form.Control
                type="text"
                id="address-1"
                {...formik.getFieldProps("address.line1")}
                placeholder="Locality/House/Street no."
                isInvalid={
                  formik.touched.address?.line1 && formik.errors.address?.line1
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address?.line1}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="City">City</Form.Label>
              <Form.Control
                type="text"
                id="City"
                {...formik.getFieldProps("address.city")}
                placeholder="Enter City Name."
                isInvalid={
                  formik.touched.address?.city && formik.errors.address?.city
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address?.city}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="zip">Postal Code</Form.Label>
              <Form.Control
                type="text"
                id="zip"
                {...formik.getFieldProps("address.zipcode")}
                placeholder="Postal Code."
                isInvalid={
                  formik.touched.address?.zipcode &&
                  formik.errors.address?.zipcode
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address?.zipcode}
              </Form.Control.Feedback>
            </Col>
            <Col sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Select Package</Form.Label>
                <Select
                  id="package_id"
                  name="package_id"
                  onChange={(option) => {
                    formik.setFieldValue("package_id", option.value);
                  }}
                  options={packages}
                />
                {formik.touched.package?.id && formik.errors.package?.id && (
                  <div className="invalid-feedback d-block">
                    {formik.errors.package?.id}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="Date">Package Start Date </Form.Label>
              <DatePicker
                name="package_start_date"
                value={moment(formik.values?.package_start_date)}
                format="DD-MM-YYYY"
                maxDate={moment(new Date())}
                onChange={(date) => {
                  formik.setFieldValue(
                    "package_start_date",
                    date ? moment(date).format("YYYY-MM-DD") : ""
                  );
                }}
                className={`form-control ${
                  formik.touched.package_start_date &&
                  formik.errors.package_start_date
                    ? "is-invalid"
                    : ""
                }`}
              />
              {formik.touched.package_start_date &&
              formik.errors.package_start_date ? (
                <div className="invalid-feedback d-block">
                  {formik.errors.package_start_date}
                </div>
              ) : null}
            </Col>
            <Col xs={6} className="form-group">
              <Form.Label htmlFor="Date">Package End Date </Form.Label>
              <DatePicker
                name="package_end_date"
                value={moment(formik.values?.package_end_date)}
                format="DD-MM-YYYY"
                onChange={(date) => {
                  formik.setFieldValue(
                    "package_end_date",
                    date ? moment(date).format("YYYY-MM-DD") : ""
                  );
                }}
                className={`form-control ${
                  formik.touched.package_end_date &&
                  formik.errors.package_end_date
                    ? "is-invalid"
                    : ""
                }`}
              />
              {formik.touched.package_end_date &&
              formik.errors.package_end_date ? (
                <div className="invalid-feedback d-block">
                  {formik.errors.package_end_date}
                </div>
              ) : null}
            </Col>
          </Row>
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
      </Can>
    </div>
  );
};

export default AddPatient;
