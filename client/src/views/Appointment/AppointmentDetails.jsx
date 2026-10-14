import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Card,
  Container,
  Accordion,
  Button,
  Badge,
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
import moment from "moment-timezone";
import { useFormik } from "formik";

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(false);
  const [activeKey, setActiveKey] = useState("0");
  const [fields, setFields] = useState([{ description: "", fee: "" }]);
  const alert = useAlert();
  const user = tokenService.getUser();
  const navigate = useNavigate();

  const loadAppointmentDetails = () => {
    dataServices
      .getAppointmentDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setAppointment(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    loadAppointmentDetails();
  }, [id, reload]);

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
    { value: "UPCOMING", label: "Upcoming" },
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Canceled" },
    { value: "CANCLED", label: "Canceled (Legacy)" },
  ];

  const formik = useFormik({
    initialValues: {
      id: appointment?.id,
      date: appointment?.date,
      time: appointment?.time,
      details: appointment?.details,
      status: appointment?.status || "UPCOMING",
      diagnosis: appointment?.diagnosis,
      fee: appointment?.fee !== undefined && appointment?.fee !== null ? appointment?.fee : 0,
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
        name: appointment?.patient?.contact?.name || appointment?.patient?.name,
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
      setSaving(true);
      dataServices
        .editAppointments(id, values)
        .then((res) => {
          if (res.status === 200) {
            alert.success("Appointment details updated successfully");
            const updatedApp =
              res.data?.data && res.data?.data?.patient
                ? res.data.data
                : res.data?.patient
                ? res.data
                : null;
            if (updatedApp) {
              setAppointment((prev) => ({ ...prev, ...updatedApp }));
            }
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
        })
        .finally(() => setSaving(false));
    },
  });

  const handleGenerateBill = () => {
    navigate("/add-invoice", { state: appointment });
  };

  const handleRecreateAppointment = () => {
    navigate("/request-appointment", { state: appointment });
  };

  const getStatusBadge = (st) => {
    const s = String(st || "").toUpperCase();
    if (s === "COMPLETED") return <Badge bg="success">Completed</Badge>;
    if (s === "CANCELLED" || s === "CANCLED") return <Badge bg="danger">Canceled</Badge>;
    return <Badge bg="primary">Active</Badge>;
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
            <Card className="bg-white mt-4 rounded-4 mb-3 shadow-sm border-0">
              <div className="p-3 pb-0">
                <Link
                  to="/appointments"
                  className="icon-link btn-outline-primary text-decoration-none d-inline-flex align-items-center"
                >
                  <span className="material-symbols-outlined me-1">arrow_back</span>
                  Back to Appointments
                </Link>
              </div>
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
                        <span>{appointment.doctor?.name || "Dr. Not Assigned"}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Date & Time:</label>
                        <span>{`${appointment.date ? moment(appointment.date).format("DD-MM-YYYY") : ""}, ${appointment.time}`}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Status:</label>
                        <span>{getStatusBadge(appointment.status)}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Consultation Fee:</label>
                        <span className="fw-bold text-success">₹{appointment.fee ?? 0}</span>
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <h6>Patient Details</h6>
                  <h5>{appointment?.patient?.name || appointment?.patient?.contact?.name || "Patient"}</h5>
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
                        <span>{appointment?.weight ? `${appointment.weight} Kg` : "N/A"}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <label>Height:</label>
                        <span>{appointment?.height ? `${appointment.height} cm` : "N/A"}</span>
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
                          <span>{appointment.seating_no || "N/A"}</span>
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col md={6}>
                        <div className="detail-item">
                          <label>Package Name:</label>
                          <span className="text-muted">No active package</span>
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

      {/* Quick Action Navigation Bar */}
      <Card className="border-0 shadow-sm rounded-4 mb-3 p-3 bg-white">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h6 className="fw-bold mb-1 text-dark d-flex align-items-center">
              <span className="material-symbols-outlined text-primary me-2">bolt</span>
              Quick Actions
            </h6>
            <small className="text-muted">
              Create an official billing invoice or schedule a follow-up consultation.
            </small>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {user.role !== "DOCTOR" && (
              <Button
                type="button"
                variant="outline-success"
                onClick={handleGenerateBill}
                className="d-inline-flex align-items-center fw-medium px-3 py-2"
              >
                <span className="material-symbols-outlined me-1 fs-5">receipt_long</span>
                Generate Invoice
              </Button>
            )}
            <Button
              type="button"
              variant="outline-primary"
              onClick={handleRecreateAppointment}
              className="d-inline-flex align-items-center fw-medium px-3 py-2"
            >
              <span className="material-symbols-outlined me-1 fs-5">calendar_add_on</span>
              Schedule Follow-up
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Clinical Consultation Form */}
      <Form onSubmit={formik.handleSubmit}>
        <Accordion
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
          className="mb-3"
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header>Patient Consultation & Vitals</Accordion.Header>
            <Accordion.Body>
              <MedicalInformation formik={formik} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Medical & Family History</Accordion.Header>
            <Accordion.Body>
              <MedicalHistory formik={formik} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Clinical Assessment & Diagnosis</Accordion.Header>
            <Accordion.Body>
              <AddDiagnosis formik={formik} user={user} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Doctor's Notes, Billing Fee & Status Card */}
        <Card className="border-0 shadow-sm rounded-4 mb-3 p-4 bg-white">
          <h6 className="fw-bold mb-3 text-dark d-flex align-items-center">
            <span className="material-symbols-outlined text-primary me-2">clinical_notes</span>
            Consultation Notes, Fees & Status
          </h6>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group controlId="doctor_note">
                <Form.Label className="fw-semibold">Doctor's Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="doctor_note"
                  disabled={user.role === "STAFF"}
                  value={formik.values?.doctor_note || ""}
                  onChange={formik.handleChange}
                  placeholder="Clinical notes, dietary advice, or patient follow-up guidance"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="fee">
                <Form.Label className="fw-semibold">Consultation Fee (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="fee"
                  disabled={user.role === "STAFF"}
                  value={formik.values?.fee ?? ""}
                  onChange={formik.handleChange}
                  placeholder="e.g. 500"
                  isInvalid={formik.touched.fee && formik.errors.fee}
                />
                {formik.touched.fee && formik.errors.fee ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.fee}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="status">
                <Form.Label className="fw-semibold">Appointment Status</Form.Label>
                <Select
                  value={
                    optionsStatus.find(
                      (option) =>
                        option.value === String(formik.values?.status).toUpperCase()
                    ) || {
                      value: formik.values?.status || "UPCOMING",
                      label: formik.values?.status || "Upcoming",
                    }
                  }
                  options={optionsStatus}
                  onChange={(option) => {
                    formik.setFieldValue("status", option.value);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {user.role !== "STAFF" && (
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                disabled={saving}
                type="submit"
                className="px-4 py-2 d-inline-flex align-items-center fw-medium"
              >
                {saving ? (
                  <>
                    <Loader size="sm" className="me-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined me-1 fs-5">save</span>
                    Save Consultation Details
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      </Form>

      {/* Prescription & Medications Section */}
      <Accordion className="mb-3">
        <Accordion.Item eventKey="prescription">
          <Accordion.Header>Prescriptions & Medications</Accordion.Header>
          <Accordion.Body>
            <Can I="list" a="Prescription">
              <Prescription appointment={appointment} />
            </Can>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Uploaded Documents & Records */}
      <Card className="border-0 shadow-sm rounded-4 mb-3 p-4 bg-white">
        <h6 className="fw-bold mb-3 text-dark d-flex align-items-center">
          <span className="material-symbols-outlined text-primary me-2">attachment</span>
          Medical Records & Documents
        </h6>
        <Row className="g-3">
          <Col md={12}>
            <FileUpload
              id={id}
              uploadApi="uploadAppointmentDocs"
              assets={appointment?.assets}
              setReload={setReload}
            />
          </Col>
          <Col md={12}>
            <AssetsView
              id={id}
              editApi="editAppointments"
              assets={appointment?.assets}
              setReload={setReload}
            />
          </Col>
        </Row>
      </Card>

      {/* Itemized Additional Fees */}
      <Card className="border-0 shadow-sm rounded-4 mb-4 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="fw-bold m-0 text-dark d-flex align-items-center">
              <span className="material-symbols-outlined text-primary me-2">payments</span>
              Additional Itemized Fees (Optional)
            </h6>
            <small className="text-muted">Itemized procedural or auxiliary charges</small>
          </div>
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleAddMore();
            }}
            className="d-inline-flex align-items-center fw-medium px-3"
          >
            <span className="material-symbols-outlined me-1 fs-6">add</span>
            Add Item
          </Button>
        </div>
        {fields.map((field, index) => (
          <Row className="g-2 align-items-end mb-2" key={index}>
            <Col md={7} xs={12}>
              <Form.Group controlId={`description-${index}`}>
                <Form.Label className="small text-muted mb-1">Description</Form.Label>
                <Form.Control
                  placeholder="e.g. Wound dressing, specialized pathology test"
                  name="description"
                  value={field.description}
                  onChange={(e) => handleFieldChange(index, e)}
                />
              </Form.Group>
            </Col>
            <Col md={3} xs={8}>
              <Form.Group controlId={`fee-${index}`}>
                <Form.Label className="small text-muted mb-1">Fee (₹)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Amount"
                  name="fee"
                  value={field.fee}
                  onChange={(e) => handleFieldChange(index, e)}
                />
              </Form.Group>
            </Col>
            <Col md={2} xs={4}>
              <Button
                type="button"
                onClick={() => handleDeleteField(index)}
                variant="outline-danger"
                className="w-100 d-inline-flex align-items-center justify-content-center"
              >
                <span className="material-symbols-outlined me-1 fs-6">delete</span>
                Remove
              </Button>
            </Col>
          </Row>
        ))}
      </Card>
    </Container>
  );
};

export default AppointmentDetails;
