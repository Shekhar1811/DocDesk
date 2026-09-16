import React, { useState } from "react";
import { useFormik } from "formik";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Select from "react-select";
import * as Yup from "yup"; // For validation schema
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import { useAlert } from "react-alert";
import { handleValidationError } from "../../components/CommonFunctions";
import { Loader } from "react-bootstrap-typeahead";
import { Can } from "./../../context/AuthProvider";

// Define the options for the Select component
const typeOptions = [
  { value: "tablet", label: "Tablet" },
  { value: "syrup", label: "Syrup" },
  { value: "capsule", label: "Capsule" },
];

const EditMedicines = () => {
  const location = useLocation();
  const med = location.state;
  const { id } = useParams();
  const alert = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: med?.name || "",
      type: med?.type || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Medicines Name is required"),
      type: Yup.string().required("Medicines Type is required"),
    }),
    onSubmit: (values) => {
      dataServices
        .editMedicine(id, values)
        .then((res) => {
          if (res.status === 200) {
            alert.success("Medicine details updated successfully");
            navigate(`/medicines-details/${id}`);
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
    <Container className="content-wrapper">
      <Can I="edit" a="Medicine">
        {med ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-2 pb-1 fw-bold text-black">Edit Medicines</h6>
            </div>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Medicines Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter Medicines name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.name && !!formik.errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group controlId="type" className="mb-3">
                    <Form.Label>Medicines Type</Form.Label>
                    <Select
                      options={typeOptions}
                      value={typeOptions.find(
                        (option) => option.value === formik.values.type
                      )}
                      onChange={(option) =>
                        formik.setFieldValue("type", option.value)
                      }
                      className={`${
                        formik.touched.type && formik.errors.type
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.type && formik.errors.type && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.type}
                      </div>
                    )}
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
            </Form>
          </>
        ) : (
          loading && <Loader />
        )}
      </Can>
    </Container>
  );
};

export default EditMedicines;
