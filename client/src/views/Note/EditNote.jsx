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
    initialValues: { name: note?.name || "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Note is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      dataServices
        .editNote(id, values)
        .then((res) => {
          console.log(res);
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
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>
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

export default EditNote;
