// DoctorListComponent.js
import React, { useEffect, useState } from "react";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import {
  getInitials,
  handleValidationError,
} from "../../components/CommonFunctions";
import { Can } from "../../context/AuthProvider";

const Doctor = () => {
  const [doctors, setDoctors] = useState();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getDoctors()
      .then((res) => {
        if (res.status === 200) {
          setDoctors(res.data);
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

  const handleDelete = (id) => {
    // Add your delete logic here
    dataServices.deleteDoctor(id).then((res) => {
      if (res.status === 200) {
        const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
        setDoctors(updatedDoctors);
        alert.success("Doctor deleted successfully");
      } else {
        alert.error("Failed to delete doctor");
      }
    });
  };

  return (
    <div className="content-wrapper">
      <div>
        {/* Specialist */}
        <Can I="list" this="Doctor">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-2 pb-1   fw-bold text-black">Doctors</h6>
              </div>
              <Can I="add" an="Doctor">
                <div>
                  <Link to="/add-doctor" className="btn btn-primary">
                    Add Doctor
                  </Link>
                </div>
              </Can>
            </div>
            <div className="list">
              {/* Doctor Cards */}
              {doctors
                ? doctors.map((doctor, i) => {
                    const { contact } = doctor;

                    return (
                      <Can I="read" an="Doctor" passThrough key={i}>
                        {(allowed) => (
                          <div className="list-item">
                            <Link
                              to={`/doctor-profile/${doctor.id}`}
                              className="d-flex"
                              disabled={!allowed}
                            >
                              <div className="list-item-avtar">
                                <div className="profileImage">
                                  {getInitials(
                                    contact.first_name + " " + contact.last_name
                                  )}
                                </div>
                              </div>
                              <div className="small">
                                <h6 className="mb-1 fs-14">
                                  {contact.first_name + " " + contact.last_name}
                                </h6>
                                <small className="text-muted">
                                  {doctor?.contact?.mobile}
                                </small>
                              </div>
                            </Link>
                            <Can I="delete" an="Doctor">
                              <Link
                                to="#"
                                className="delete-icon"
                                onClick={() => handleDelete(doctor.id)}
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </Link>
                            </Can>
                          </div>
                        )}
                      </Can>
                    );
                  })
                : loading && <Loader />}
            </div>
          </div>
        </Can>
      </div>
    </div>
  );
};

export default Doctor;
