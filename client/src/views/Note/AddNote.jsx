import React, { useState } from "react";
import { useFormik } from "formik";
import { Row, Col, Button, Form } from "react-bootstrap";
import * as Yup from "yup"; // For validation schema
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import dataServices from "../../apiServices/data.services";
import { handleValidationError } from "../../components/CommonFunctions";
import { Can } from "../../context/AuthProvider";

const AddNote = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Initialize useFormik hook
  const formik = useFormik({
    initialValues: { title: "", description: "" },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Note description is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .addNote({
          title: values.title,
          description: values.description,
          name: values.title,
        })
        .then((res) => {
          if (res.status === 201) {
            alert.success("Note added successfully");
            navigate(`/note`);
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
      <Can I="add" a="Note">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-2 pb-1 fw-bold text-black">Add Note</h6>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col sm={12} className="mb-3">
              <div className="form-group">
                <label htmlFor="title" className="form-label fw-medium">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form-control ${
                    formik.touched.title && formik.errors.title
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="e.g. Clinical Follow-up Instructions"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="invalid-feedback">{formik.errors.title}</div>
                ) : null}
              </div>
            </Col>
            <Col sm={12} className="mb-3">
              <div className="form-group">
                <label htmlFor="description" className="form-label fw-medium">Note Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className={`form-control ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter detailed clinical note..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className="invalid-feedback">{formik.errors.description}</div>
                ) : null}
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
                Save Note
              </Button>
            </Col>
          </Row>
        </Form>
      </Can>
    </div>
  );
};

export default AddNote;
