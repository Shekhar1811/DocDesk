import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Button } from "react-bootstrap";
import dataServices from "../../apiServices/data.services";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";

const AddPackages = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const initialValues = {
    name: "",
    amount: "",
    description: "",
    seating_count: 1,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Package Name is required"),
    amount: Yup.string().required("Price is required"),
    seating_count: Yup.number()
      .required("Seating Count is required")
      .min(1, "Seating count cannot be less than 1"),
  });

  const handleSubmit = (values) => {
    setLoading(true);
    dataServices
      .addPackage(values)
      .then((res) => {
        if (res.status === 201) {
          alert.success("Package added successfully");
          navigate("/packages");
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-2 pb-1 fw-bold text-black">Add Package</h6>
      </div>
      <Can I="add" this="Package">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <Row>
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="name">Package Name</label>
                      <Field
                        name="name"
                        type="text"
                        className={`form-control ${
                          touched.name && errors.name ? "is-invalid" : ""
                        }`}
                        placeholder="Enter package name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="amount">Price</label>
                      <Field
                        name="amount"
                        type="text"
                        className={`form-control ${
                          touched.amount && errors.amount ? "is-invalid" : ""
                        }`}
                        placeholder="Enter package price"
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="seating_count">Seatings</label>
                      <Field
                        name="seating_count"
                        type="number"
                        className={`form-control ${
                          touched.seating_count && errors.seating_count
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter package seating count"
                      />
                      <ErrorMessage
                        name="seating_count"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group">
                      <label htmlFor="description">Descriptions</label>
                      <Field
                        name="description"
                        as="textarea"
                        rows={3}
                        className={`form-control ${
                          touched.description && errors.description
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter description"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
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
              </div>
            </Form>
          )}
        </Formik>
      </Can>
    </div>
  );
};

export default AddPackages;
