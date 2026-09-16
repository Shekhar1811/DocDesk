import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

const MedicalInformation = ({ formik }) => {
  console.log(formik.values);
  return (
    <>
      <Row>
        <Col sm={6}>
          <Form.Group>
            <Form.Label>Initial Consultation</Form.Label>
            <Form.Control
              as="textarea"
              id="details"
              placeholder="Initial Consultation"
              name="details"
              value={formik.values?.details}
              onChange={formik.handleChange}
              isInvalid={formik.touched?.details && formik.errors?.details}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors?.details}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label>Current Condition</Form.Label>
            <Form.Control
              as="textarea"
              id="current_condition"
              placeholder="Details"
              name="current_condition"
              value={formik.values?.current_condition}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched?.current_condition &&
                formik.errors?.current_condition
              }
            />
            <Form.Text className="text-muted">
              Note: Brief description of the patient’s current health complaints
              or symptoms.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {formik.errors?.current_condition}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <br />
      <Row>
        <Col sm={6}>
          <Form.Group>
            <Form.Label>Observations Details</Form.Label>
            <Form.Control
              as="textarea"
              id="observation_details"
              placeholder="observations and findings"
              name="observation_details"
              value={formik.values?.observation_details}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched?.observation_details &&
                formik.errors?.observation_details
              }
            />
            <Form.Text className="text-muted">
              Note: Doctor’s observations and findings during the examination.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {formik.errors?.observation_details}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group>
            <Form.Label>Investigation Details</Form.Label>
            <Form.Control
              id="investigation_details"
              type="text"
              className="form-control"
              name="investigation_details"
              value={formik.values?.investigation_details}
              onChange={formik.handleChange}
              placeholder="Investigation details"
            />
            <Form.Text className="text-muted">
              Note: List of tests ordered or performed with results (if
              available). Example: Blood Test, X-Ray, MRI
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default MedicalInformation;
