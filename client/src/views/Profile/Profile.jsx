// Profile.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "./../../components/Loader/Loader";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";

const Profile = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  useEffect(() => {
    setLoading(true);
    dataServices
      .getUser()
      .then((res) => {
        if (res.status == "200") {
          setUserData(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="content-wrapper">
      <div>
        <div className="bg-white rounded-4 px-3  mt-4 pt-3 overflow-hidden edit-profile-back   mb-3">
          <h6 className="pb-2">Personal Info</h6>
          {userData ? (
            <>
              <div className="d-flex">
                <div className="col">
                  <p>
                    <span className="text-muted small">Name</span>
                    <br />
                    {userData?.contact?.first_name +
                      " " +
                      userData?.contact?.last_name}
                  </p>
                </div>
                <div className="col">
                  <p>
                    <span className="text-muted small">Date of Birth</span>
                    <br />
                    {userData?.date_of_birth}
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
                    {userData?.contact?.mobile}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col">
                  <p>
                    <span className="text-muted small">Email</span>
                    <br />
                    {userData?.contact?.email}
                  </p>
                </div>
                <div className="col">
                  <p>
                    <span className="text-muted small">Location</span>
                    <br />
                    India
                  </p>
                </div>
              </div>
            </>
          ) : (
            loading && <Loader />
          )}
          <Link to="/edit-profile" className="link-dark">
            <div className="edit-profile-icon bg-primary text-white">
              <span className="material-symbols-outlined h2 m-0">edit</span> 
            </div>
          </Link>
        </div>
        {/*  <div className="rounded-4   overflow-hidden">
          <Link to="/appointment" className="link-dark">
            <div className="bg-white d-flex align-items-center justify-content-between p-3 border-bottom">
              <h6 className="m-0">My Appointment</h6>
              <span className="mdi mdi-chevron-right mdi-24px icon   rounded-pill"></span>
            </div>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
