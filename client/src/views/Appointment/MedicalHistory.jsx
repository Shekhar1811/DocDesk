import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const MedicalHistory = ({ formik }) => {
  return (
    <div>
      <Row>
        <Col>
          <ul>
            <li>Diabetes - Diagnosed in 2015</li>
            <li> Hypertension - Diagnosed in 2015</li>
            <li>Knee Replacement - Diagnosed in 2015</li>
            <li> Gallbladder Removal - Diagnosed in 2015</li>
            <li>Flu Vaccine - Diagnosed in 2015</li>
          </ul>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group className="form-group">
            <Form.Label>Medical History</Form.Label>
            <Form.Control
              as="textarea"
              id="medical_history"
              placeholder="Enter Details"
              name="medical_history"
              value={formik.values?.medical_history}
              onChange={formik.handleChange}
              className={
                formik.touched?.medical_history &&
                formik.errors?.medical_history
                  ? "is-invalid"
                  : ""
              }
            />
            <span className="small">
              Note: Summary of past medical conditions, treatments, surgeries,
              allergies, etc.
            </span>
            {formik.touched?.medical_history &&
              formik.errors?.medical_history && (
                <div className="invalid-feedback d-block">
                  {formik.errors?.medical_history}
                </div>
              )}
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group className="form-group">
            <Form.Label>Family History</Form.Label>
            <Form.Control
              as="textarea"
              id="family_medical_history"
              placeholder="Enter Details"
              name="family_medical_history"
              value={formik.values?.family_medical_history}
              onChange={formik.handleChange}
              className={
                formik.touched?.family_medical_history &&
                formik.errors?.family_medical_history
                  ? "is-invalid"
                  : ""
              }
            />
            <span className="small">
              Note: Details of genetic or hereditary conditions in the family.
            </span>
            {formik.touched?.family_medical_history &&
              formik.errors?.family_medical_history && (
                <div className="invalid-feedback d-block">
                  {formik.errors?.family_medical_history}
                </div>
              )}
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </div>
  );
};

export default MedicalHistory;
