import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Card,
  Container,
  Accordion,
  Button,
} from "react-bootstrap";
import Select from "react-select";
import { useNavigate, Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import dataServices from "../../apiServices/data.services";
import { useAlert } from "react-alert";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import FileUpload from "../../components/FileUploader/FileUpload";
import AssetsView from "../../components/FileUploader/AssetsView";
import Prescription from "./Prescription";
import AddDiagnosis from "./AddDiagnosis";
import MedicalInformation from "./MedicalInformation";
import MedicalHistory from "./MedicalHistory";
import tokenService from "../../apiServices/token.service";
import { useFormik } from "formik";

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [fields, setFields] = useState([{ description: "", fee: "" }]);
  const alert = useAlert();
  const user = tokenService.getUser();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getAppointmentDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setAppointment(res.data);
          console.log(res.data)
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

  const handleAddMore = () => {
    setFields([...fields, { description: "", fee: "" }]);
  };

  const handleFieldChange = (index, e) => {
    const updatedFields = fields.map((field, i) => {
      if (i === index) {
        return { ...field, [e.target.name]: e.target.value };
      }
      return field;
    });
    setFields(updatedFields);
  };

  const handleDeleteField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const optionsStatus = [
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCLED", label: "Canceled" },
    { value: "CANCLED", label: "Reschedule" },
  ];

  const formik = useFormik({
    initialValues: {
      id: appointment?.id,
      date: appointment?.date,
      time: appointment?.time,
      details: appointment?.details,
      status: appointment?.status,
      diagnosis: appointment?.diagnosis,
      fee: appointment?.fee,
      doctor_note: appointment?.doctor_note,
      assets: appointment?.assets,
      weight: appointment?.weight,
      height: appointment?.height,
      seating_no: appointment?.seating_no,
      bp_detail: appointment?.bp_detail,
      medical_history: appointment?.medical_history,
      family_medical_history: appointment?.family_medical_history,
      current_condition: appointment?.current_condition,
      observation_details: appointment?.observation_details,
      investigation_details: appointment?.investigation_details,
      treatment_plan: appointment?.treatment_plan,
      procedures: appointment?.procedures,
      patient: {
        id: appointment?.patient?.id,
        name: appointment?.patient?.contact?.name,
        date_of_birth: appointment?.patient?.date_of_birth,
        gender: appointment?.patient?.gender,
        assets: appointment?.patient?.assets,
      },
      package: {
        id: appointment?.package?.id,
        name: appointment?.package?.name,
        seating_count: appointment?.package?.seating_count,
        available_count: appointment?.package?.available_count,
        amount: appointment?.package?.amount,
      },
      doctor: {
        id: appointment?.doctor?.id,
        name: appointment?.doctor?.name,
      },
      created_at: appointment?.created_at,
      updated_at: appointment?.updated_at,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .editAppointments(id, values)
        .then((res) => {
          if (res.status === 200) {
            if (values.appstatuslabel === "Reschedule") {
              handleRecreateAppointment();
              alert.info("Rescheduling appointment");
            } else {
              alert.success("Appointment details updated successfully");
              const updatedApp = res.data?.data && res.data?.data?.patient ? res.data.data : (res.data?.patient ? res.data : null);
              if (updatedApp) {
                setAppointment((prev) => ({ ...prev, ...updatedApp }));
              }
            }
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
          setLoading(false);
        })
        .finally(() => setLoading(false));
    },
  });

  const handleGenerateBill = () => {
    navigate("/add-invoice", { state: appointment });
  };
  const handleRecreateAppointment = () => {
    navigate("/request-appointment", { state: appointment });
  };

  if (loading && !appointment) {
    return (
      <Container className="content-wrapper py-5">
        <Loader fullPage />
      </Container>
    );
  }
  if (!appointment) return <div className="p-4 text-center text-muted">No appointment data available.</div>;
  return (
    <Container className="content-wrapper">
      <Row className="justify-content-center">
        <Can I="read" an="Appointment">
          <Col>
            <Card className="bg-white mt-4 rounded-4 mb-3">
              <a
                href="#"
                className="icon-link p-2 btn-outline-primary"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back
              </a>
              <Card.Body>
                <Can not I="edit" a="appointment">
                  <Link to={`/edit-appointment/${id}`} className="link-dark">
                    <div className="edit-profile-icon bg-primary text-white">
                      <span className="material-symbols-outlined h2 m-0">
                        edit
                      </span>
                    </div>
                  </Link>
                </Can>

                <div className="profile-card">
                  <h6>Appointment Details</h6>
                  <Row>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Doctor Name:</label>
                        <span>{appointment.doctor?.name}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Date:</label>
                        <span>{`${appointment.date}, ${appointment.time}`}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Status:</label>
                        <span>{appointment.status}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Fee:</label>
                        <span>{appointment.fee}</span>
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <h6>Patient Details</h6>
                  <h5>{appointment?.patient?.name || "Patient"}</h5>
                  <Row>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>DOB:</label>
                        <span>{appointment?.patient?.date_of_birth || "N/A"}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Gender:</label>
                        <span>{appointment?.patient?.gender || "N/A"}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Weight:</label>
                        <span>{appointment?.weight} Kg</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Height:</label>
                        <span>{appointment?.height} cm</span>
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <h6>Package Details</h6>
                  {appointment.package && appointment.package.id ? (
                    <Row>
                      <Col md={6}>
                        <div className="detail-item">
                          <label>Package Name:</label>
                          <span>{appointment.package.name}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="detail-item">
                          <label>Seating Number:</label>
                          <span>{appointment.seating_no}</span>
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col md={6}>
                        <div className="detail-item">
                          <label>Package Name:</label>
                          <span className="text-danger">No active package</span>
                        </div>
                      </Col>
                    </Row>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Can>
      </Row>

      <Form onSubmit={formik.handleSubmit}>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Patient's Information</Accordion.Header>
            <Accordion.Body>
              <MedicalInformation formik={formik} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Medical History</Accordion.Header>
            <Accordion.Body>
              <MedicalHistory formik={formik} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Clinical Assessment</Accordion.Header>
            <Accordion.Body>
              <AddDiagnosis formik={formik} user={user} />
            </Accordion.Body>
          </Accordion.Item>
          <Row>
            <Form.Group className="mt-2" controlId="diagnosis">
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="text"
                name="doctor_note"
                disabled={user.role === "STAFF"}
                value={formik.values?.doctor_note || ""}
                onChange={formik.handleChange}
                placeholder="Note"
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mt-2" controlId="diagnosis">
              <Form.Label>Fees</Form.Label>
              <Form.Control
                type="number"
                name="fee"
                disabled={user.role === "STAFF"}
                value={formik.values?.fee || ""}
                onChange={formik.handleChange}
                placeholder="Fee"
                isInvalid={formik.touched.fee && formik.errors.fee}
              />
              {formik.touched.fee && formik.errors.fee ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.fee}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group className="form-group">
              <Form.Label>Select Status</Form.Label>
              <Select
                value={optionsStatus.find(
                  (option) => option.value === formik.values?.status || null
                )}
                options={optionsStatus}
                onChange={(option) => {
                  formik.setFieldValue("status", option.value);
                  formik.setFieldValue("appstatuslabel", option.label);
                }}
              />
            </Form.Group>
          </Row>
          {user.role !== "STAFF" && (
            <Button
              variant="primary"
              disabled={loading}
              type="submit"
              className="mt-3 w-100"
            >
              Submit
            </Button>
          )}
        </Accordion>
      </Form>
      <Accordion>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Prescription</Accordion.Header>
          <Accordion.Body>
            <Can I="list" a="Prescription">
              <Prescription appointment={appointment} />
            </Can>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className="d-flex">
        {user.role !== "DOCTOR" && (
          <Button
            variant="primary"
            disabled={loading}
            onClick={handleGenerateBill}
            className="mt-3 w-100"
          >
            Generate Invoice
          </Button>
        )}
        <Button
          onClick={handleRecreateAppointment}
          variant="primary"
          className="mt-3 w-100"
        >
          Create Appointment
        </Button>
      </div>
      <h6 className="mt-4">Upload Documents</h6>
      <Row>
        <FileUpload
          id={id}
          uploadApi="uploadAppointmentDocs"
          assets={appointment?.assets}
          setReload={setReload}
        />
        <AssetsView
          id={id}
          editApi="editAppointments"
          assets={appointment?.assets}
          setReload={setReload}
        />
      </Row>

      <div>
        <h6 className="mt-4">Additional Fees and Descriptions</h6>
        {fields.map((field, index) => (
          <div className="d-flex" key={index}>
            <Form.Group className="form-group">
              <Form.Label>Add Description</Form.Label>
              <Form.Control
                id={`description-${index}`}
                placeholder="Enter Details"
                name="description"
                value={field.description}
                onChange={(e) => handleFieldChange(index, e)}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Fee</Form.Label>
              <Form.Control
                id={`fee-${index}`}
                placeholder="Enter Fee"
                name="fee"
                value={field.fee}
                onChange={(e) => handleFieldChange(index, e)}
              />
            </Form.Group>
            <button
              type="button"
              onClick={() => handleDeleteField(index)}
              className="btn btn-danger ms-2"
            >
              Delete
            </button>
          </div>
        ))}
        <a href="#" onClick={handleAddMore}>
          Add More
        </a>
      </div>
    </Container>
  );
};

export default AppointmentDetails;
