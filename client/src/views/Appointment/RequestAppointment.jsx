import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import dataServices from "../../apiServices/data.services";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import * as Yup from "yup";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";

const RequestAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState();
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

    dataServices.getPatientsSlim().then((res) => {
      if (res.status === 200) {
        const options = res.data.map((patient) => ({
          value: patient.id,
          label: patient.name,
          is_expiring_soon: patient.is_expiring_soon,
          package: patient?.package,
        }));
        setPatients(options);
      }
    });
  }, []);

  const validationSchema = Yup.object({
    patient_id: Yup.number().required("Please select a patient"),
    doctor_id: Yup.number().required("Please select a doctor"),
    // package_id: Yup.number().required("Please select a package"),
    details: Yup.string().required("Please provide appointment details"),
    date: Yup.string().required("Please select a date"),
    /* .test("isValidDate", "Invalid date format", (value) => {
        return moment(value, "YYYY-MM-DD", true).isValid();
      })
      .test("isFutureDate", "Date must be today or in the future", (value) => {
        return moment(value, "YYYY-MM-DD").isSameOrAfter(moment(), "day");
      }), */
    time: Yup.string().required("Please select a time"),
    /* .test("isValidTime", "Time must be in the future", function (value) {
        const { date } = this.parent;
        const selectedDate = moment(date, "YYYY-MM-DD");
        const selectedTime = moment(value, "HH:mm");
        if (selectedDate.isSame(moment(), "day")) {
          return selectedTime.isAfter(moment());
        }
        return true;
      }), */
  });
  const handleDateTimeChange = (newValue) => {
    const date = moment(newValue).format("YYYY-MM-DD");
    const time = moment(newValue).format("HH:mm");
    formik.setFieldValue("date", date);
    formik.setFieldValue("time", time);
  };
  const formik = useFormik({
    initialValues: {
      patient_id: data?.patient.id,
      doctor_id: data?.doctor.id,
      package_id: data?.package.id,
      details: data?.details,
      height: data?.height,
      weight: data?.weight,
      date: moment(new Date()).format("YYYY-MM-DD"),
      time: moment().add(1, "hour").format("HH:mm"),
      status: "ACTIVE",
    },
    enableReinitialize: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      dataServices
        .addAppointments(values)
        .then((res) => {
          if (res.status === 201) {
            toast.success("Appointment added successfully");
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

  useEffect(() => {
    setSelectedPatient(data?.package);
  }, [data]);

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-2 pb-1 fw-bold text-black">Add Appointment</h6>
        </div>
      </div>
      <Can I="add" an="Appointment">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Select Patient</Form.Label>
                <Select
                  id="patient"
                  name="patient_id"
                  options={patients}
                  value={patients.find(
                    (patient) => patient.value === formik.values.patient_id
                  )}
                  onChange={(option) => {
                    setSelectedPatient(option);
                    formik.setFieldValue(
                      "package_id",
                      option.package.available_count > 0
                        ? option.package.id
                        : null
                    );
                    formik.setFieldValue("patient_id", option.value);
                  }}
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
            <Col sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Select Doctor</Form.Label>
                <Select
                  id="doctor"
                  name="doctor_id"
                  options={doctors}
                  value={doctors.find(
                    (doctor) => doctor.value === formik.values.doctor_id
                  )}
                  onChange={(option) =>
                    formik.setFieldValue("doctor_id", option.value)
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
          </Row>
          <Row>
            <Col xs={6}>
              <Form.Group className="form-group">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Weight in Kg"
                  name="weight"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="form-group">
                <Form.Label>Height</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Height in cm"
                  name="height"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          {selectedPatient && selectedPatient?.package?.id !== null ? (
            <Row>
              <Col sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>Selected Package</Form.Label>
                  <span> {selectedPatient?.package?.name}</span>
                  {(selectedPatient?.is_expiring_soon) ?
                    <span className="list-item__info">
                      <div className="badge badge-danger ms-2">Expire Soon</div>
                    </span>
                    : ""}
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>Seating Details</Form.Label>
                  {selectedPatient?.package?.available_count > 0 ? (
                    <>
                      <span>Total: {selectedPatient?.package?.seating_count}</span>/
                      <span>Completed: {(selectedPatient?.package?.seating_count - selectedPatient?.package?.available_count)}</span>
                      
                    </>
                  ) : (
                    <span className="text-danger">No seatings available</span>
                  )}
                </Form.Group>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <Form.Group className="form-group">
                  <Form.Label>Selected Package</Form.Label>
                  <span className="text-danger">No active package </span>
                </Form.Group>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <Form.Group className="form-group">
                <Form.Label>Select Date & Time</Form.Label>
                <DateTimePicker
                  // minDate={moment(new Date())}
                  value={
                    formik.values.date
                      ? moment(`${formik.values.date}T${formik.values.time}`)
                      : null
                  }
                  onChange={handleDateTimeChange}
                  className={`form-control ${formik.touched.date && formik.errors.date
                      ? "is-invalid"
                      : formik.touched.time && formik.errors.time
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
          </Row>

          <Row>
          <Col sm={12}>
              <Form.Group className="form-group">
                <Form.Label>Add Initial Consultation</Form.Label>
                <Form.Control
                  as="textarea"
                  id="details"
                  placeholder="Enter Note"
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
          <Row>
            <Col sm={12} className="mt-3">
              <Button
                variant="primary"
                disabled={loading}
                type="submit"
                className="w-100"
              >
                Request For Appointment
              </Button>
            </Col>
          </Row>
        </Form>
      </Can>
    </div>
  );
};

export default RequestAppointment;
