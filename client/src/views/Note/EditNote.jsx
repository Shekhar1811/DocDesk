import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Row, Col, Button, Form } from "react-bootstrap";
import * as Yup from "yup"; // For validation schema
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import dataServices from "../../apiServices/data.services";
import { handleValidationError } from "../../components/CommonFunctions";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";

const EditNote = () => {
  const { id } = useParams();
  const alert = useAlert();
  const navigate = useNavigate();
  const [note, setNote] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dataServices
      .getNoteDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setNote(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Initialize useFormik hook
  const formik = useFormik({
    initialValues: {
      title: note?.title || note?.name || "",
      description: note?.description || note?.name || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Note description is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .editNote(id, {
          title: values.title,
          description: values.description,
          name: values.title,
        })
        .then((res) => {
          if (res.status === 200) {
            alert.success("Note details updated successfully");
            navigate(`/note-details/${id}`);
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
      <Can I="edit" a="Note">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-2 pb-1 fw-bold text-black">Edit Note</h6>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          {note ? (
            <>
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
                      placeholder="Enter Note Title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.title && formik.errors.title ? (
                      <div className="invalid-feedback">
                        {formik.errors.title}
                      </div>
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
                      placeholder="Enter Note Description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.description && formik.errors.description ? (
                      <div className="invalid-feedback">
                        {formik.errors.description}
                      </div>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button 
                    type="button" 
                    variant="outline-secondary"
                    className="btn w-100" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.back();
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col className="footer mt-auto">
                  <Button type="submit" disabled={loading} className="btn btn-primary w-100">
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

export default EditNote;
