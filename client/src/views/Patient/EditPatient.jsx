import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import dataServices from "../../apiServices/data.services";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import Select from "react-select";
import Loader from "../../components/Loader/Loader";
import moment from "moment-timezone";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { genderOptions } from "../../constants";

const EditPatient = () => {
  const [patient, setPatient] = useState();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getPatientsDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setPatient(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
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
  }, []);

  const validationSchema = Yup.object().shape({
    contact: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      mobile: Yup.string().required("Phone Number is required"),
    }),
    // package: Yup.object().shape({
    //   package_id: Yup.number().required("Please select a package"),
    //   amount: Yup.number().required(),
    //   name: Yup.string().required(),
    // }),
    // package_id: Yup.number().required("Please select a package"),

    // date_of_birth: Yup.date().required("Date of Birth is required"),
    registration_date: Yup.date().required("Registration date is required"),
    gender: Yup.string().required("Gender is required"),
    // diagnosis: Yup.string().required("Diagnosis is required"),
    address: Yup.object().shape({
      // line1: Yup.string().required("Address Line 1 is required"),
      // line2: Yup.string().required("Address Line 2 is required"),
      city: Yup.string().required("City is required"),
      // zipcode: Yup.string().required("Postal Code is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      contact: {
        name: patient?.contact?.name || "",
        mobile: patient?.contact?.mobile || "",
      },
      package_id: patient?.package?.id || "",
      date_of_birth: patient?.date_of_birth || "",
      package_start_date: patient?.package_start_date || "",
      package_end_date: patient?.package_end_date || "",
      registration_date: patient?.registration_date || "",
      gender: patient?.gender || "",
      address: {
        line1: patient?.address?.line1 || "",
        city: patient?.address?.city || "",
        zipcode: patient?.address?.zipcode || "",
      },
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .editPatients(id, values)
        .then((res) => {
          if (res.status === 200) {
            alert.success("Patient details updated successfully");
            navigate(`/patient-profile/${id}`);
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
          <h6 className="mb-2 pb-1 fw-bold text-black">Edit Patients</h6>
        </div>
      </div>
      <Can I="edit" a="Patient">
        <Form onSubmit={formik.handleSubmit}>
          {patient ? (
            <>
              <Row>
                <Col xs={12} className="form-group">
                  <Form.Label htmlFor="name-f">Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="name-f"
                    {...formik.getFieldProps("contact.name")}
                    placeholder="Enter name."
                    isInvalid={
                      formik.touched.contact?.name &&
                      formik.errors.contact?.name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.contact?.name}
                  </Form.Control.Feedback>
                </Col>
                <Col xs={6} className="form-group">
                  <Form.Label htmlFor="tel">Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    id="tel"
                    {...formik.getFieldProps("contact.mobile")}
                    placeholder="Enter   Contact Number."
                    isInvalid={
                      formik.touched.contact?.mobile &&
                      formik.errors.contact?.mobile
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.contact?.mobile}
                  </Form.Control.Feedback>
                </Col>

                <Col xs={6}>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="gender">Gender</Form.Label>
                    <Select
                      id="gender"
                      name="gender"
                      options={genderOptions}
                      value={genderOptions.find(
                        (option) => formik.values.gender === option.value
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue("gender", selectedOption.value);
                      }}
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
                </Col>
                {/* <Col sm={6} className="form-group">
                  <Form.Label htmlFor="diagnosis">Diagnosis</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="diagnosis"
                    {...formik.getFieldProps("diagnosis")}
                    placeholder="Enter Diagnosis"
                    isInvalid={
                      formik.touched.diagnosis && formik.errors.diagnosis
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.diagnosis}
                  </Form.Control.Feedback>
                </Col> */}
                <Col sm={6} className="form-group">
                  <Form.Label htmlFor="address-1">Address Line-1</Form.Label>
                  <Form.Control
                    type="text"
                    id="address-1"
                    {...formik.getFieldProps("address.line1")}
                    placeholder="Locality/House/Street no."
                    isInvalid={
                      formik.touched.address?.line1 &&
                      formik.errors.address?.line1
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address?.line1}
                  </Form.Control.Feedback>
                </Col>
                {/* <Col sm={6} className="form-group">
                <Form.Label htmlFor="address-2">Address Line-2</Form.Label>
                <Form.Control
                  type="text"
                  id="address-2"
                  {...formik.getFieldProps("address.line2")}
                  placeholder="Village/City Name."
                  isInvalid={
                    formik.touched.address?.line2 && formik.errors.address?.line2
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address?.line2}
                </Form.Control.Feedback>
              </Col> */}
                <Col xs={6} className="form-group">
                  <Form.Label htmlFor="City">City</Form.Label>
                  <Form.Control
                    type="text"
                    id="City"
                    {...formik.getFieldProps("address.city")}
                    placeholder="Enter  City name."
                    isInvalid={
                      formik.touched.address?.city &&
                      formik.errors.address?.city
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
                <Col sm={12}>
                  <Form.Group className="form-group">
                    <Form.Label>Select Package</Form.Label>
                    <Select
                      id="package_id"
                      name="package_id"
                      value={packages.find(
                        (pkg) => pkg.value === formik.values.package_id
                      )}
                      onChange={(option) => {
                        formik.setFieldValue("package_id", option.value);
                      }}
                      options={packages}
                    />
                    {formik.touched.package_id && formik.errors.package_id && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.package_id}
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
                    name="package_start_date"
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
                  className="btn btn-primary w-100"
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

export default EditPatient;
