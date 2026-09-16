import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import { useAlert } from "react-alert";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";

const EditPackage = () => {
  const { id } = useParams();
  const alert = useAlert();
  const navigate = useNavigate();
  const [servicePackage, setServicePackage] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dataServices
      .getPackageDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setServicePackage(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: servicePackage?.name || "",
      amount: servicePackage?.amount || "",
      description: servicePackage?.description || "",
      seating_count: servicePackage?.seating_count || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Package Name is required"),
      amount: Yup.string().required("Price is required"),
      seating_count: Yup.number()
        .required("Seating Count is required")
        .min(1, "Seating count cannot be less than 1"),
    }),
    onSubmit: (values) => {
      dataServices
        .editPackage(id, values)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            alert.success("Package details updated successfully");
            navigate(`/packages-details/${id}`);
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
        <h6 className="mb-2 pb-1 fw-bold text-black">Edit Package</h6>
      </div>
      <Can I="edit" this="Package">
        <Form onSubmit={formik.handleSubmit}>
          {servicePackage ? (
            <>
              <Row>
                <Col sm={6}>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="name">Package Name</Form.Label>
                    <Form.Control
                      id="name"
                      name="name"
                      type="text"
                      className={`form-control ${
                        formik.touched.name && formik.errors.name
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter package name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="amount">Price</Form.Label>
                    <Form.Control
                      id="amount"
                      name="amount"
                      type="text"
                      className={`form-control ${
                        formik.touched.amount && formik.errors.amount
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter package amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.amount && formik.errors.amount ? (
                      <div className="invalid-feedback">
                        {formik.errors.amount}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="seating_count">Seatings</Form.Label>
                    <Form.Control
                      id="seating_count"
                      name="seating_count"
                      type="number"
                      className={`form-control ${
                        formik.touched.seating_count &&
                        formik.errors.seating_count
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter package seating count"
                      value={formik.values.seating_count}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.seating_count &&
                    formik.errors.seating_count ? (
                      <div className="invalid-feedback">
                        {formik.errors.seating_count}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="description">Descriptions</Form.Label>
                    <Form.Control
                      id="description"
                      name="description"
                      as="textarea"
                      rows={3}
                      className={`form-control ${
                        formik.touched.description && formik.errors.description
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.description && formik.errors.description ? (
                      <div className="invalid-feedback">
                        {formik.errors.description}
                      </div>
                    ) : null}
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
                  <Button type="submit" className="btn btn-primary w-100">
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

export default EditPackage;
