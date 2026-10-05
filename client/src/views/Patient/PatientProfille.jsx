import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import moment from "moment-timezone";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Can } from "./../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import FileUpload from "../../components/FileUploader/FileUpload";
import tokenService from "../../apiServices/token.service";
import AppointmentDocs from "./AppointmentDocs";
import AssetsView from "../../components/FileUploader/AssetsView";

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState();
  const [appointments, setAppointments] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const alert = useAlert();
  const user = tokenService.getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        dataServices.getPatientsDetails(id),
        dataServices.getAppointmentHistory(id),
      ])
        .then(([patientRes, historyRes]) => {
          if (patientRes.status === 200) {
            setPatient(patientRes.data);
          }
          if (historyRes.status === 200) {
            setAppointments(historyRes.data);
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, reload]);

  return (
    <Container className="content-wrapper">
      <Row className="justify-content-center">

        <Can I="read" a="Patient">



          <Col>

            <Card className="bg-white mt-4 rounded-4 mb-3">
              <Card.Body>

                {patient ? (
                  <>
                    <Can I="edit" a="Patient">
                      <Link to={`/edit-patient/${id}`} className="link-dark">
                        <div className="edit-profile-icon bg-primary text-white">
                          <span className="material-symbols-outlined h2 m-0">
                            edit
                          </span>
                        </div>
                      </Link>
                    </Can>

                    <div className="profile-card">
                      {/* Initial Letters Instead of Profile Photo */}
                      <div className="initials-circle">JD</div>

                      {/* Patient Info */}
                      <div className="profile-info">
                        <h1>{patient.contact.name}</h1>
                        <p className="text-muted">Patient ID: PAT{patient.id}</p>
                        <p>35 | {patient.gender} | DOB:  {patient.date_of_birth &&
                          moment(patient.date_of_birth).format("DD-MM-YYYY")}</p>
                        <p>Registration Date: {patient.registration_date &&
                          moment(patient.registration_date).format(
                            "DD-MM-YYYY"
                          )}</p>
                      </div>
                      <div className="detail-section">
                        <h2>Contact Details</h2>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="detail-item">
                              <label>Phone:</label>
                              <span>
                                {user.role !== "DOCTOR"
                                  ? patient.contact.mobile
                                  : "**********"}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="detail-item">
                              <label>Email:</label>
                              {/* <span>{patient.contact.name}</span> */}
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="detail-item">
                              <label>Address:</label>
                              <span>
                                {`${patient?.address?.line1
                                  ? patient?.address?.line1
                                  : ""
                                  } ${patient?.address?.city ? patient?.address?.city : ""
                                  } ${patient?.address?.zipcode
                                    ? patient?.address?.zipcode
                                    : ""
                                  }`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <br />

                        <h2>Package Details</h2>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="detail-item">
                              <label>Package Name:</label>
                              <span> {patient?.package?.name}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="detail-item">
                              <label>Amount:</label>
                              <span>{patient?.package?.amount}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="detail-item">
                              <label>Total Seatings:</label>
                              <span>{patient?.package?.seating_count}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="detail-item">
                              <label>Available Seatings:</label>
                              <span>{patient?.package?.available_count}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="detail-item">
                              <label>Package Start Date:</label>
                              <span>
                                {patient.package_start_date &&
                                  moment(patient.package_start_date).format(
                                    "DD-MM-YYYY"
                                  )}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="detail-item">
                              <label>Package End Date:</label>
                              <span>
                                {patient.package_end_date &&
                                  moment(patient.package_end_date).format(
                                    "DD-MM-YYYY"
                                  )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <Card.Title>Patient Info </Card.Title>
                    <Row className="mb-3">
                      <Col>
                        <Card.Text>
                          <span className="text-muted small">Name</span>
                          <br />
                          {patient.contact.name}
                        </Card.Text>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Card.Text>
                          <span className="text-muted small">
                            Registration Date
                          </span>
                          <br />
                          {patient.registration_date &&
                            moment(patient.registration_date).format(
                              "DD-MM-YYYY"
                            )}
                        </Card.Text>
                      </Col>
                      <Col>
                        <Card.Text>
                          <span className="text-muted small">
                            Date of Birth
                          </span>
                          <br />
                          {patient.date_of_birth &&
                            moment(patient.date_of_birth).format("DD-MM-YYYY")}
                        </Card.Text>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Card.Text>
                          <span className="text-muted small">Gender</span>
                          <br />
                          {patient.gender}
                        </Card.Text>
                      </Col>
                      <Col>
                        <Card.Text>
                          <span className="text-muted small">Phone</span>
                          <br />
                          {user.role !== "DOCTOR"
                            ? patient.contact.mobile
                            : "**********"}
                        </Card.Text>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col>
                        <Card.Text>
                          <span className="text-muted small">Address</span>
                          <br />
                          {`${patient?.address?.line1
                            ? patient?.address?.line1
                            : ""
                            } ${patient?.address?.city ? patient?.address?.city : ""
                            } ${patient?.address?.zipcode
                              ? patient?.address?.zipcode
                              : ""
                            }`}
                        </Card.Text>
                      </Col>
                    </Row>
                    <br />
                    <span className="">Package Details</span>
                    <hr className="mt-2 mb-2" />
                    <Row>
                      <Col>
                        <Card.Text>
                          <div className=" ">
                            <div>
                              <span className="text-muted small">Name: </span>
                              {patient?.package?.name}
                            </div>
                            <div className="d-flex flex-row  ">
                              <div className="p-2 ps-0 ">
                                <span className="text-muted small">Amount: </span> <br />
                                {patient?.package?.amount}
                              </div>
                              <div className="p-2 ms-4">
                                <span className="text-muted small">
                                  Total Seatings:
                                </span> <br />
                                {patient?.package?.seating_count}</div>
                              <div className="p-2 ms-4">
                                <span className="text-muted small">
                                  Available Seatings:
                                </span> <br />
                                {patient?.package?.available_count}
                              </div>
                            </div>
                          </div>
                        </Card.Text>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Card.Text>
                          <span className="text-muted small">
                            Package End Date
                          </span>
                          <br />
                          {patient.package_end_date &&
                            moment(patient.package_end_date).format(
                              "DD-MM-YYYY"
                            )}

                        </Card.Text>
                      </Col>
                      <Col>
                        <Card.Text>
                          <span className="text-muted small">
                            Package Start Date
                          </span>
                          <br />
                          {patient.package_start_date &&
                            moment(patient.package_start_date).format(
                              "DD-MM-YYYY"
                            )}
                        </Card.Text>
                      </Col>
                    </Row> */}
                  </>
                ) : (
                  loading && <Loader />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Can>
      </Row>

      <Button
        onClick={() =>
          navigate("/diagnosis-history", {
            state: { appointments, id: patient?.id },
          })
        }
      >
        Diagnosis History
      </Button>
      <br />
      <br />
      <Tabs
        defaultActiveKey="appointmentHistory"
        id="uncontrolled-tab-example"
        className="mb-3"
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <Tab eventKey="appointmentHistory" title="Appointments">
          <Can I="list" an="Appointment">
            <div className="list">
              {appointments ? (
                appointments.map((appointment, index) => (
                  <div className="list-item" key={index}>
                    <Can I="edit" an="Appointment" passThrough>
                      {(allowed) => (
                        <Link
                          className="d-flex w-100"
                          to={`/appointment-details/${appointment.id}`}
                          disabled={!allowed}
                        >
                          <div className="list-item-content">
                            <span className="list-item__name">
                              <span className="mdi mdi-calendar-month text-primary me-1"></span>
                              {appointment.date}, {appointment.time}
                            </span>
                            <span className="list-item__info">
                              <strong className="text-dark">Note:</strong>
                              <br />
                              {appointment.details}
                            </span>
                            <br />
                            {appointment.diagnosis && (
                              <span className="list-item__info">
                                <strong className="text-dark">
                                  Diagnosis:
                                </strong>
                                {appointment.diagnosis}
                              </span>
                            )}
                          </div>
                        </Link>
                      )}
                    </Can>
                  </div>
                ))
              ) : loading ? (
                <Loader />
              ) : (
                <p>No history found!</p>
              )}
            </div>
          </Can>
        </Tab>
        <Tab eventKey="uploadDocument" title="Documents">
        <h5>Upload Documents</h5> 
          <FileUpload
            id={id}
            uploadApi="uploadPatientDocs"
            setReload={setReload}
          />
          <AssetsView
            assets={patient?.assets}
            setReload={setReload}
            id={id}
            editApi="editPatients"
          />
        </Tab>
        <Tab eventKey="appointmentDocuments" title="Appointment">
          <AppointmentDocs id={patient?.id} />
        </Tab>
        <Tab eventKey="patientHistory" title="Patient History">
        <div className="medical-history">
        <h5>Medical History</h5>
        <ul>
        <li>Diabetes -  <span>Diagnosed in 2015</span></li>
        <li>Hypertension - <span>Diagnosed in 2015</span></li>
        <li>Knee Replacement - <span>Diagnosed in 2015</span></li>
        <li>Gallbladder Removal - <span>Diagnosed in 2015</span></li>
        <li>Flu Vaccine - <span>Diagnosed in 2015</span></li>
        <li>COVID-19 Vaccine - <span>Diagnosed in 2015</span></li>
            
        </ul>
    </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default PatientProfile;
