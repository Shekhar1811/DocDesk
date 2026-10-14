import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Select from "react-select";
import dataServices from "../../apiServices/data.services";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import * as Yup from "yup";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import Loader from "../../components/Loader/Loader";

const RequestAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vitalsSource, setVitalsSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    dataServices.getDoctors().then((res) => {
      if (res.status === 200) {
        const options = res.data.map((doctor) => ({
          value: doctor.id,
          label: `${doctor.contact.first_name} ${doctor.contact.last_name}`,
        }));
        setDoctors(options);
      }
    });

    dataServices.getPatients().then((res) => {
      if (res.status === 200) {
        const options = res.data.map((patient) => ({
          value: patient.id,
          label: patient.contact?.name || patient.name,
          is_expiring_soon: patient.is_expiring_soon,
          package_id: patient.package_id,
          package: patient.package,
        }));
        setPatients(options);
      }
    });

    dataServices.getPackages().then((res) => {
      if (res.status === 200) {
        setPackages(res.data);
      }
    });
  }, []);

  const fetchPatientPreviousVitals = async (patientId) => {
    try {
      const res = await dataServices.getAppointmentHistory(patientId);
      if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
        const pastWithVitals = res.data.find(
          (a) =>
            (a.height && String(a.height).trim() !== "") ||
            (a.weight && String(a.weight).trim() !== "")
        );
        if (pastWithVitals) {
          if (pastWithVitals.height) {
            formik.setFieldValue("height", pastWithVitals.height);
          }
          if (pastWithVitals.weight) {
            formik.setFieldValue("weight", pastWithVitals.weight);
          }
          setVitalsSource(
            `Pre-filled from previous visit on ${pastWithVitals.date}`
          );
          return;
        }
      }
      setVitalsSource(null);
    } catch (err) {
      console.error("Error fetching previous vitals:", err);
      setVitalsSource(null);
    }
  };

  const validationSchema = Yup.object({
    patient_id: Yup.number().required("Please select a patient"),
    doctor_id: Yup.number().required("Please select a doctor"),
    details: Yup.string().required("Please provide appointment details"),
    date: Yup.string().required("Please select a date"),
    time: Yup.string().required("Please select a time"),
  });

  const handleDateTimeChange = (newValue) => {
    const date = moment(newValue).format("YYYY-MM-DD");
    const time = moment(newValue).format("HH:mm");
    formik.setFieldValue("date", date);
    formik.setFieldValue("time", time);
  };

  const formik = useFormik({
    initialValues: {
      patient_id: data?.patient?.id || "",
      doctor_id: data?.doctor?.id || "",
      package_id: data?.package?.id || data?.patient?.package?.id || "",
      details: data?.details || "",
      height: data?.height || "",
      weight: data?.weight || "",
      date: moment(new Date()).format("YYYY-MM-DD"),
      time: moment().add(1, "hour").format("HH:mm"),
      status: "ACTIVE",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .addAppointments(values)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            alert.success("Appointment booked successfully");
            navigate("/appointments");
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
          setLoading(false);
        })
        .finally(() => setLoading(false));
    },
  });

  // Handle patient selection and auto-select their enrolled package
  const handlePatientSelect = (option) => {
    setSelectedPatient(option);
    formik.setFieldValue("patient_id", option ? option.value : "");

    const activePkg = option?.package;
    const available =
      activePkg?.available_count !== null && activePkg?.available_count !== undefined
        ? Number(activePkg.available_count)
        : Number(activePkg?.seating_count || 0);

    if (activePkg && activePkg.id && available > 0) {
      formik.setFieldValue("package_id", activePkg.id);
    } else {
      formik.setFieldValue("package_id", "");
    }

    if (option?.value) {
      fetchPatientPreviousVitals(option.value);
    } else {
      setVitalsSource(null);
    }
  };

  // Sync navigation state if present
  useEffect(() => {
    if (data?.patient?.id && patients.length > 0) {
      const matched = patients.find((p) => p.value === data.patient.id);
      if (matched) {
        setSelectedPatient(matched);
        formik.setFieldValue("patient_id", matched.value);

        const activePkg = matched.package;
        const available =
          activePkg?.available_count !== null && activePkg?.available_count !== undefined
            ? Number(activePkg.available_count)
            : Number(activePkg?.seating_count || 0);

        if (activePkg && activePkg.id && available > 0) {
          formik.setFieldValue("package_id", activePkg.id);
        }

        if (data?.height || data?.weight) {
          setVitalsSource("Pre-filled from current appointment");
        } else {
          fetchPatientPreviousVitals(matched.value);
        }
      }
    }
  }, [data, patients]);

  // Build package options dynamically for the selected patient
  const buildPackageOptions = () => {
    const options = [];

    const activePkg = selectedPatient?.package;
    const available =
      activePkg?.available_count !== null && activePkg?.available_count !== undefined
        ? Number(activePkg.available_count)
        : Number(activePkg?.seating_count || 0);

    // Case 1: Patient HAS an ACTIVE package with sessions remaining (> 0)
    // Business logic: Do NOT allow blindly switching/updating an active package from a routine appointment form!
    if (activePkg && activePkg.id && available > 0) {
      // 1. Their active package (default option)
      options.push({
        value: activePkg.id,
        label: `Active Package: ${activePkg.name} (${available} sessions remaining)`,
        isActive: true,
        available,
      });

      // 2. Standard consultation (pay per visit) in case visiting for an issue outside their package
      options.push({
        value: "",
        label: "Standard Consultation (General OPD — Pay Per Visit)",
        isStandard: true,
      });

      return options;
    }

    // Case 2: Patient has NO active package, OR their previous package has 0 sessions left
    options.push({
      value: "",
      label: "Standard Consultation (General OPD — Pay Per Visit)",
      isStandard: true,
      isExhausted: !!(activePkg && available <= 0),
    });

    if (packages.length > 0) {
      packages.forEach((pkg) => {
        const isPrevious = activePkg && activePkg.id === pkg.id;
        options.push({
          value: pkg.id,
          label: `${isPrevious ? "Renew: " : "Enroll in: "}${pkg.name} — ₹${pkg.amount} (${pkg.seating_count} sessions)`,
          isNewEnrollment: true,
          pkg,
        });
      });
    }

    return options;
  };

  const packageOptions = buildPackageOptions();
  const selectedPackageOption =
    packageOptions.find(
      (opt) => String(opt.value) === String(formik.values.package_id || "")
    ) || packageOptions[0];

  return (
    <div className="content-wrapper">
      <div className="mb-3">
        <Link
          to="/appointments"
          className="icon-link btn-outline-primary text-decoration-none d-inline-flex align-items-center mb-2"
        >
          <span className="material-symbols-outlined me-1">arrow_back</span>
          Back to Appointments
        </Link>
        <h5 className="fw-bold text-black mb-1">Book / Request Appointment</h5>
        <small className="text-muted">
          Schedule a consultation for new or existing patients.
        </small>
      </div>

      <Can I="add" an="Appointment">
        <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
          <Form onSubmit={formik.handleSubmit}>
            <Row className="g-3">
              {/* Row 1: Patient and Doctor */}
              <Col md={6}>
                <Form.Group controlId="patient">
                  <Form.Label className="fw-semibold">Select Patient *</Form.Label>
                  <Select
                    id="patient"
                    name="patient_id"
                    options={patients}
                    placeholder="Search or select patient..."
                    value={
                      patients.find(
                        (patient) => patient.value === formik.values.patient_id
                      ) || null
                    }
                    onChange={handlePatientSelect}
                    className={
                      formik.touched.patient_id && formik.errors.patient_id
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.patient_id && formik.errors.patient_id && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.patient_id}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="doctor">
                  <Form.Label className="fw-semibold">Select Doctor *</Form.Label>
                  <Select
                    id="doctor"
                    name="doctor_id"
                    options={doctors}
                    placeholder="Search or select attending doctor..."
                    value={
                      doctors.find(
                        (doctor) => doctor.value === formik.values.doctor_id
                      ) || null
                    }
                    onChange={(option) =>
                      formik.setFieldValue("doctor_id", option ? option.value : "")
                    }
                    className={
                      formik.touched.doctor_id && formik.errors.doctor_id
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.doctor_id && formik.errors.doctor_id && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.doctor_id}
                    </div>
                  )}
                </Form.Group>
              </Col>

              {/* Row 2: Consultation / Package Type and Date & Time */}
              <Col md={6}>
                <Form.Group controlId="package_type">
                  <Form.Label className="fw-semibold">
                    Consultation / Package Plan
                  </Form.Label>
                  <Select
                    id="package_type"
                    name="package_id"
                    options={packageOptions}
                    value={selectedPackageOption}
                    onChange={(option) => {
                      formik.setFieldValue("package_id", option ? option.value : "");
                    }}
                  />
                  {!selectedPatient ? (
                    <small className="text-muted d-block mt-1">
                      Note: Select a patient to view package or consultation options.
                    </small>
                  ) : selectedPackageOption?.isActive ? (
                    <small className="text-muted d-block mt-1">
                      Note: 1 session will be utilized from patient's active package ({selectedPackageOption.available - 1} remaining after this visit).
                    </small>
                  ) : selectedPackageOption?.isNewEnrollment ? (
                    <small className="text-muted d-block mt-1">
                      Note: Patient will be enrolled into this package starting with this visit.
                    </small>
                  ) : selectedPackageOption?.isExhausted ? (
                    <small className="text-muted d-block mt-1">
                      Note: Previous package sessions are completed (0 remaining). Standard consultation fee applies upon invoicing.
                    </small>
                  ) : (
                    <small className="text-muted d-block mt-1">
                      Note: Standard consultation fee applies upon invoicing.
                    </small>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="dateTime">
                  <Form.Label className="fw-semibold">
                    Appointment Date & Time *
                  </Form.Label>
                  <DateTimePicker
                    value={
                      formik.values.date
                        ? moment(`${formik.values.date}T${formik.values.time}`)
                        : null
                    }
                    onChange={handleDateTimeChange}
                    className={`form-control ${
                      (formik.touched.date && formik.errors.date) ||
                      (formik.touched.time && formik.errors.time)
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.date && formik.errors.date ? (
                    <div className="invalid-feedback d-block">
                      {formik.errors.date}
                    </div>
                  ) : null}
                  {formik.touched.time && formik.errors.time ? (
                    <div className="invalid-feedback d-block">
                      {formik.errors.time}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>

              {/* Row 3: Weight and Height */}
              <Col md={6}>
                <Form.Group controlId="weight">
                  <Form.Label className="fw-semibold">Weight (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="e.g. 70"
                    name="weight"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                  />
                  {vitalsSource ? (
                    <small className="text-muted d-block mt-1">
                      Note: {vitalsSource} (update if changed)
                    </small>
                  ) : (
                    <small className="text-muted d-block mt-1">
                      Note: Record vitals taken at reception or leave blank
                    </small>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="height">
                  <Form.Label className="fw-semibold">Height (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="e.g. 175"
                    name="height"
                    value={formik.values.height}
                    onChange={formik.handleChange}
                  />
                  <small className="text-muted d-block mt-1">
                    Note: Recorded in cm (used for clinical baseline)
                  </small>
                </Form.Group>
              </Col>

              {/* Row 4: Initial Consultation Reason / Symptoms */}
              <Col md={12}>
                <Form.Group controlId="details">
                  <Form.Label className="fw-semibold">
                    Initial Consultation Reason / Symptoms *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    id="details"
                    placeholder="Briefly describe patient's primary symptoms, reason for visit, or referral note..."
                    name="details"
                    value={formik.values.details}
                    onChange={formik.handleChange}
                    className={
                      formik.touched.details && formik.errors.details
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.details && formik.errors.details && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.details}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Row 5: Submit Button */}
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                disabled={loading}
                type="submit"
                className="px-4 py-2 d-inline-flex align-items-center fw-medium"
              >
                {loading ? (
                  <>
                    <Loader size="sm" className="me-2" />
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined me-1 fs-5">event_available</span>
                    Confirm & Book Appointment
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card>
      </Can>
    </div>
  );
};

export default RequestAppointment;
