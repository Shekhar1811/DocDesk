import React, { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { useAlert } from "react-alert";
import {
  getInitials,
  handleValidationError,
  showAlert,
} from "../../components/CommonFunctions";
import { Can } from "./../../context/AuthProvider";
import Select from "react-select";

const Patient = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientOptions, setPatientOptions] = useState([]);
  const [filteredPatient, setFilteredPatient] = useState();
  const alert = useAlert();

  const getPatients = () => {
    setLoading(true);
    dataServices
      .getPatients()
      .then((res) => {
        if (res.status === 200) {
          const result = res.data;
          setPatients(result);
          setAllPatients(result);
          const options = result.map((patient) => ({
            value: patient.id,
            label: patient.contact?.name || `${patient.contact?.first_name || ""} ${patient.contact?.last_name || ""}`.trim() || `Patient #${patient.id}`,
          }));
          setPatientOptions(options);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getPatients();
  }, []);

  const handleDelete = (id) => {
    dataServices
      .deletePatient(id)
      .then((res) => {
        if (res.status === 200) {
          const updatedDoctors = patients.filter(
            (patient) => patient.id !== id
          );
          setPatients(updatedDoctors);
          alert.success("Patient deleted successfully");
        } else {
          alert.error("Failed to delete patient");
        }
      })
      .catch((err) => {
        if (err.response.status === 500) {
          alert.error("This patient cannot be deleted");
        } else {
          alert.error(handleValidationError(err));
        }
      });
  };
  return (
    <div className=" content-wrapper">
      <div>
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-2 pb-1 fw-bold text-black">Patients</h6>
            <Can I="add" a="Patient">
              <Link to="/add-patient" className="btn btn-primary">
                Add Patient
              </Link>
            </Can>
          </div>
          <Can I="list" a="Patient">
            <Form.Group className="form-group">
              <Form.Label>Search Patient</Form.Label>
              <Select
                id="patient"
                isClearable={true}
                options={patientOptions}
                onChange={(option) => {
                  if (option) {
                    const result = allPatients.filter((patient) => {
                      return patient.id === option.value;
                    });
                    setPatients(result);
                  } else {
                    setPatients(allPatients);
                  }
                }}
              />
            </Form.Group>
            <div className="list">
              {patients.length > 0
                ? patients.toReversed().map((patient) => {
                    const { contact } = patient;
                    return (
                      <div key={patient.id} className="list-item">
                        <Can I="read" a="Patient" passThrough>
                          {(allowed) => (
                            <Link
                              to={`/patient-profile/${patient.id}`}
                              className="d-flex w-100 "
                              disabled={!allowed}
                            >
                              <div className="list-item-avtar">
                                <div className="profileImage">
                                  {getInitials(contact.name)}
                                </div>
                              </div>
                              <div className="list-item-content">
                                <strong className="list-item__name">
                                  {contact.name}
                                </strong>
                                <div className="d-flex justify-content-between">
                                  <span className="list-item__info">
                                    ID:{patient.id}
                                  </span>
                                  <span className="list-item__info">
                                    City: {patient.address?.city}
                                  </span>
                                  {(patient.is_expiring_soon) ?
                                    <span className="list-item__info">
                                      <div className="badge badge-danger">Expire Soon</div>  
                                    </span>
                                  : ""}
                                </div>
                              </div>
                            </Link>
                          )}
                        </Can>
                        <Can I="delete" a="Patient">
                          <Link
                            className="delete-icon"
                            onClick={() =>
                              showAlert("Patient", handleDelete, patient.id)
                            }
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </Link>
                        </Can>
                      </div>
                    );
                  })
                : loading && <Loader />}
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
};

export default Patient;
