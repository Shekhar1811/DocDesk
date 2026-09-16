import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Can } from "./../../context/AuthProvider";
import { Button } from "react-bootstrap";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";

const EmployeeProfile = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [employee, setEmployee] = useState();
  const alert = useAlert();
  useEffect(() => {
    setLoading(true);
    dataServices
      .getEmployeeDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setEmployee(res.data);
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

  return (
    <div className="content-wrapper">
      <div>
        {employee ? (
          <Can I="read" an="Employee">
            <div className="bg-white rounded-4  mt-4 px-3 pt-3 overflow-hidden edit-profile-back   mb-3">
              <h6 className="pb-2">Employee Info</h6>
              <div className="d-flex">
                <div className="col">
                  <p>
                    <span className="text-muted small">Name</span>
                    <br />
                    {employee?.contact?.first_name +
                      " " +
                      employee?.contact?.last_name}
                  </p>
                </div>
                <div className="col">
                  <p>
                    <span className="text-muted small">Date of Birth</span>
                    <br />
                    {employee?.date_of_birth}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col">
                  <p>
                    <span className="text-muted small">Gender</span>
                    <br />
                    Male
                  </p>
                </div>
                <div className="col">
                  <p>
                    <span className="text-muted small">Phone</span>
                    <br />
                    {employee?.contact?.mobile}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col">
                  <p>
                    <span className="text-muted small">Email</span>
                    <br />
                    {employee?.contact?.email}
                  </p>
                </div>
                <div className="col">
                  <p>
                    <span className="text-muted small">Designation</span>
                    <br />
                    {employee.designation}
                  </p>
                </div>
                
              </div>
              <div className="d-flex">
              <div className="col">
                  <p>
                    <span className="text-muted small">Employee ID</span>
                    <br />
                    {employee?.id}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col">
                  <p>
                    <span className="text-muted small">Address</span>
                    <br />
                    {`${
                      employee?.address?.line1 ? employee?.address?.line1 : ""
                    }  ${
                      employee?.address?.city ? employee?.address?.city : ""
                    }  ${
                      employee?.address?.zipcode
                        ? employee?.address?.zipcode
                        : ""
                    }`}
                  </p>
                </div>
              </div>
              <Can I="edit" an="Employee">
                <Link to={`/edit-employee/${id}`} className="link-dark">
                  <div className="edit-profile-icon bg-primary text-white">
                    <span className="material-symbols-outlined h2 m-0">edit</span>  
                  </div>
                </Link>
              </Can>
            </div>
          </Can>
        ) : (
          loading && <Loader />
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
