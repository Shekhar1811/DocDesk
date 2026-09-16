import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Select from "react-select";
import moment from "moment-timezone";
import dataServices from "../../apiServices/data.services";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import Loader from "../../components/Loader/Loader";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";

const EditBill = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [invoice, setInvoice] = useState();

  useEffect(() => {
    dataServices.getPatients().then((res) => {
      if (res.status === 200) {
        const options = res.data.map((patient) => ({
          value: patient.id,
          label: `${patient.contact.first_name} ${patient.contact.last_name}`,
        }));
        setPatients(options);
      }
    });
    dataServices
      .getInvoiceDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setInvoice(res.data);
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

  const handleSelectChange = (selectedOption) => {
    formik.setFieldValue("patient_id", selectedOption.value);
  };
  const initialValues = {
    patient_id: invoice?.patient?.id,
    payment_date: invoice?.payment_date,
    paid_by: invoice?.paid_by,
    amount: invoice?.amount,
    description: invoice?.description,
    transaction_number: invoice?.transaction_number,
  };

  const validationSchema = Yup.object().shape({
    patient_id: Yup.string().required("Patient Name is required"),
    payment_date: Yup.date().required("Date is required"),
    paid_by: Yup.string().required("Payment method is required"),
    amount: Yup.string().required("Amount is required"),
    description: Yup.string().required("Descriptions are required"),
    transaction_number: Yup.string().test(
      "required-when-cheque-or-online",
      "Transaction number is required",
      function (value) {
        const { paid_by } = this.parent;
        return (
          (paid_by !== "Cheque" && paid_by !== "Online") ||
          (value && value.trim().length > 0)
        );
      }
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .editInvoice(id, values)
        .then((res) => {
          if (res.status === 200) {
            alert.success("Invoice updated successfully");
            navigate("/invoice");
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
      <Row className="d-flex justify-content-between align-items-center mb-3">
        <Col>
          <h6 className="mb-2 pb-1 fw-bold text-black">Generate Invoice</h6>
        </Col>
      </Row>
      <Can I="edit" an="Invoice">
        <Form onSubmit={formik.handleSubmit}>
          {invoice ? (
            <>
              <Row>
                <Col sm={6}>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="patient_id">Patient Name</Form.Label>
                    <Select
                      id="patient_id"
                      name="patient_id"
                      options={patients}
                      value={patients.find(
                        (option) => option.value === formik.values.patient_id
                      )}
                      /* defaultValue={patients.find(
                    (option) => option.value === formik.values.patient_id
                  )} */
                      onChange={handleSelectChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.patient_id && formik.errors.patient_id
                          ? "is-invalid"
                          : ""
                      }
                      placeholder="Select Patient Name"
                    />
                    {formik.touched.patient_id && formik.errors.patient_id ? (
                      <div className="invalid-feedback d-block">
                        {formik.errors.patient_id}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="payment_date">Date</Form.Label>
                    <DatePicker
                      name="payment_date"
                      value={moment(formik.values?.payment_date)}
                      format="DD-MM-YYYY"
                      maxDate={moment(new Date())}
                      onChange={(date) => {
                        formik.setFieldValue(
                          "payment_date",
                          date ? moment(date).format("YYYY-MM-DD") : ""
                        );
                      }}
                      className={`form-control ${
                        formik.touched.payment_date &&
                        formik.errors.payment_date
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.payment_date &&
                    formik.errors.payment_date ? (
                      <div className="invalid-feedback d-block">
                        {formik.errors.payment_date}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Check
                      type="radio"
                      inline
                      name="paid_by"
                      value="Cash"
                      id="inlineRadio1"
                      className="me-2"
                      checked={formik.values.paid_by === "Cash"}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.paid_by && formik.errors.paid_by
                      }
                      label="Cash"
                    />
                    <Form.Check
                      type="radio"
                      inline
                      name="paid_by"
                      value="Cheque"
                      id="inlineRadio2"
                      className="me-2"
                      checked={formik.values.paid_by === "Cheque"}
                      onChange={formik.handleChange}
                      label="Cheque"
                      isInvalid={
                        formik.touched.paid_by && formik.errors.paid_by
                      }
                    />
                    <Form.Check
                      type="radio"
                      inline
                      name="paid_by"
                      value="Online"
                      id="inlineRadio3"
                      className="me-2"
                      checked={formik.values.paid_by === "Online"}
                      onChange={formik.handleChange}
                      label="Online"
                      isInvalid={
                        formik.touched.paid_by && formik.errors.paid_by
                      }
                    />
                    {formik.touched.paid_by && formik.errors.paid_by ? (
                      <div className="invalid-feedback d-block">
                        {formik.errors.paid_by}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                {(formik.values.paid_by === "Cheque" ||
                  formik.values.paid_by === "Online") && (
                  <Col sm={6}>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="transaction_number">
                        Transaction Number
                      </Form.Label>
                      <Form.Control
                        id="transaction_number"
                        name="transaction_number"
                        type="text"
                        value={formik.values.transaction_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.transaction_number &&
                          formik.errors.transaction_number
                        }
                        placeholder="Enter transaction number"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.transaction_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                )}
                <Col sm={6}>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="amount">Amount</Form.Label>
                    <Form.Control
                      id="amount"
                      name="amount"
                      type="text"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.amount && formik.errors.amount}
                      placeholder="Enter Amount"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.amount}
                    </Form.Control.Feedback>
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
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.description && formik.errors.description
                      }
                      placeholder="description"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.description}
                    </Form.Control.Feedback>
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
                    Save Change
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            loading && <Loader />
          )}
        </Form>
      </Can>
    </Container>
  );
};

export default EditBill;
