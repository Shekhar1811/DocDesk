import React from "react";
import { Form, Row } from "react-bootstrap";

const AddDiagnosis = ( {formik, user} ) => {
  return (
    <div>
      <p>Diagnosis Details</p>
        <Form.Group className="mt-2" controlId="diagnosis">
          <Form.Control
            as="textarea"
            rows={2}
            name="diagnosis"
            value={formik.values?.diagnosis || ""}
            disabled={user.role === "STAFF"}
            onChange={formik.handleChange}
            placeholder="Diagnosis Details"
            isInvalid={formik.touched.diagnosis && formik.errors.diagnosis}
          />
          {formik.touched.diagnosis && formik.errors.diagnosis ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.diagnosis}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <br />
        <Row>
          <Form.Group className="mt-2" controlId="diagnosis">
            <Form.Label>Treatment Plan</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="treatment_plan"
              disabled={user.role === "STAFF"}
              value={formik.values?.treatment_plan || ""}
              onChange={formik.handleChange}
              placeholder="Treatment Plan"
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mt-2" controlId="diagnosis">
            <Form.Label>Procedure </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="procedures"
              disabled={user.role === "STAFF"}
              value={formik.values?.procedures || ""}
              onChange={formik.handleChange}
              placeholder="Procedure details"
            />
          </Form.Group>
        </Row>
    </div>
  );
};

export default AddDiagnosis;
