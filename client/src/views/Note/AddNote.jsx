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
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Note is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      dataServices
        .addNote(values)
        .then((res) => {
          console.log(res);
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
          <h6 className="mb-2 pb-1 fw-bold text-black">Edit Note</h6>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col>
              <div className="form-group">
                <label htmlFor="name">Note</label>
                <textarea
                  name="name"
                  className={`form-control ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter Note"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="invalid-feedback">{formik.errors.name}</div>
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
                Save Changes
              </Button>
            </Col>
          </Row>
        </Form>
      </Can>
    </div>
  );
};

export default AddNote;
