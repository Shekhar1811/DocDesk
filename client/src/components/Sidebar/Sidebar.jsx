import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../apiServices/auth.service";
import tokenService from "../../apiServices/token.service";
import dataServices from "../../apiServices/data.services";
import { getInitials } from "../CommonFunctions";
import { Can } from "./../../context/AuthProvider";

const Sidebar = (props) => {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setUserData(tokenService.getUser());
  }, []);

  const handleLogout = () => {
    const token = tokenService.getLocalAccessToken();
    dataServices
      .logout({
        access_token: token,
      })
      .then((res) => {
        authService.logout();
        props.setShow(false);
        navigate("/sign-in");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Offcanvas
      show={props.show}
      onHide={() => props.setShow(false)}
      placement="start"
    >
      <Offcanvas.Body className="p-0">
        <nav
          id="main-nav"
          className="hc-offcanvas-nav hc-nav-1 nav-levels-overlap nav-position-left disable-body"
        >
          <ul className="second-nav">
            <li className="osahan-user-profile bg-primary">
              <div className="d-flex align-items-center gap-2 justify-content-between">
                <div className="d-flex align-items-center gap-2  ">
                  <Link
                    to="/my-profile"
                    aria-label="Doctor Profile"
                    className="p-0"
                    onClick={() => props.setShow(false)}
                  >
                    <div className="list-item-avtar">
                      <div className="profileImage rounded-pill img-fluid">
                        {getInitials(userData?.name)}
                      </div>
                    </div>
                  </Link>
                  <div className="ps-1">
                    <h6 className="fw-bold text-white mb-0">
                      {userData?.name}
                    </h6>
                    <p className="text-white-50 m-0 small">
                      {userData?.mobile}
                    </p>
                  </div>
                </div>
                <div>
                  <Link
                    to="#"
                    onClick={() => props.setShow(false)}
                    className="text-white"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </Link>
                </div>
              </div>
            </li>
            <li>
              <Can I="read" this="Home">
                <Link onClick={() => props.setShow(false)} to="/">
                  <span className="material-symbols-outlined  me-3">
                    dashboard
                  </span>
                  Home
                </Link>
              </Can>
            </li>
            <li>
              <Can I="list" this="Employee">
                <Link onClick={() => props.setShow(false)} to="/employees">
                  <span className="material-symbols-outlined me-3">badge</span>
                  Employees
                </Link>
              </Can>
            </li>
            <li>
              <Can I="list" this="Doctor">
                <Link onClick={() => props.setShow(false)} to="/doctors">
                  <span className="material-symbols-outlined  me-3">
                    stethoscope
                  </span>
                  Doctors
                </Link>
              </Can>
            </li>
            <li>
              <Can I="list" this="Patient">
                <Link onClick={() => props.setShow(false)} to="/patients">
                  <span className="material-symbols-outlined me-3">
                    personal_injury
                  </span>
                  Patients
                </Link>
              </Can>
            </li>
            <li>
              <Can I="list" this="Appointment">
                <Link onClick={() => props.setShow(false)} to="/appointments">
                  <span className="material-symbols-outlined me-3">
                    calendar_month
                  </span>
                  Appointments
                </Link>
              </Can>
            </li>
            <li>
              <Can I="list" this="Package">
                <Link onClick={() => props.setShow(false)} to="/packages">
                  <span className="material-symbols-outlined me-3">
                    medical_services
                  </span>
                  Service Packages
                </Link>
              </Can>
            </li>
            <li>
              <Can I="list" this="Invoice">
                <Link onClick={() => props.setShow(false)} to="/invoice">
                  <span className="material-symbols-outlined me-3">
                    receipt_long
                  </span>
                  Invoices
                </Link>
              </Can>
            </li>
            <li>
              <Can I="list" this="Medicine">
                <Link onClick={() => props.setShow(false)} to="/medicines">
                  <span className="material-symbols-outlined  me-3">
                    medication
                  </span>
                  Medicines
                </Link>
              </Can>
            </li>
            <li>
              <Can I="list" this="Note">
                <Link onClick={() => props.setShow(false)} to="/note">
                  <span className="material-symbols-outlined  me-3">
                    description
                  </span>
                  Notes
                </Link>
              </Can>
            </li>
            <Can I="list" this="Report">
              <li>
                <Link onClick={() => props.setShow(false)} to="/reports">
                  <span className="material-symbols-outlined  me-3">
                    analytics
                  </span>
                  Reports & Analytics
                </Link>
              </li>
            </Can>
            <Can I="read" this="Clinic">
              <li>
                <Link onClick={() => props.setShow(false)} to="/clinic-profile">
                  <span className="material-symbols-outlined  me-3">
                    domain
                  </span>
                  Clinic Profile
                </Link>
              </li>
            </Can>
            <li>
              <Link to="#" onClick={handleLogout}>
                <span className="material-symbols-outlined  me-3">
                  power_settings_new
                </span>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;
