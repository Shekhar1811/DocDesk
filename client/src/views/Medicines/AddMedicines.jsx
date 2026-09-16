import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Select from "react-select";
import * as Yup from "yup"; // For validation schema
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import { useAlert } from "react-alert";
import { handleValidationError } from "../../components/CommonFunctions";
import { Typeahead } from "react-bootstrap-typeahead";
import { Can } from "./../../context/AuthProvider";

// Define the options for the Select component
const typeOptions = [
  { value: "tablet", label: "Tablet" },
  { value: "syrup", label: "Syrup" },
  { value: "capsule", label: "Capsule" },
];

const EditMedicines = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [masterMedicines, setMasterMedicines] = useState();

  useEffect(() => {
    dataServices
      .getMasterMedicines()
      .then((res) => {
        if (res.status === 200) {
          setMasterMedicines(res.data);
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

  const checkIfMedExists = (name) => {
    const existingPatient = masterMedicines.find(
      (med) => med.name.toLowerCase() === name.toLowerCase()
    );
    if (existingPatient) {
      return true;
    }
    return false;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Medicines Name is required"),
      type: Yup.string().required("Medicines Type is required"),
    }),
    onSubmit: (values) => {
      dataServices
        .addMedicine(values)
        .then((res) => {
          if (res.status === 201) {
            alert.success("Medicine added successfully");
            navigate(`/medicines`);
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
      <Can I="add" a="Medicine">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-2 pb-1 fw-bold text-black">Add Medicines</h6>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col sm={6} className="form-group">
              <Form.Label htmlFor="name">Name</Form.Label>
              <Typeahead
                id="name"
                onChange={(selected) => {
                  if (selected.length > 0) {
                    formik.setFieldValue("name", selected[0]);
                  }
                }}
                options={masterMedicines?.map((med) => med.name)}
                placeholder="Select or type a name"
                onBlur={(e) => {
                  if (!checkIfMedExists(e.target.value)) {
                    formik.setFieldValue("name", e.target.value);
                  }
                }}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">
                  {formik.errors.contact.name}
                </div>
              )}
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
        </Form>
      </Can>
    </Container>
  );
};

export default EditMedicines;
