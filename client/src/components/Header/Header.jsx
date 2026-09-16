import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import tokenService from "../../apiServices/token.service";
import { IMAGE_URL } from "../../constants";

const Header = (props) => {
  const [userData, setUserData] = useState();
  useEffect(() => {
    setUserData(tokenService.getUser());
  }, []);
  return (
    <div className=" osahan-header">
      <div className="ps-2 p-1 ">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center gap-2 me-auto">
            <Link to="/my-profile" aria-label="Doctor Profile">
              <div className="list-item-avtar">
                <img
                  src={IMAGE_URL + userData?.clinic?.favicon?.url}
                  // src={`/img/clinic-logo/${userData?.clinic?.logo_url}`}
                  alt="Clinic Logo"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />
                {/* <div className="profileImage">{getInitials(userData?.name)}</div> */}
              </div>
            </Link>
            <div className="ps-1">
              <p className="fw-bold mb-0 text-primary">
                {userData?.clinic?.name}
              </p>
              <p className="text-orange m-0 small">
                {userData?.clinic?.address?.city}
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-end gap-2">
            <Link
              className="toggle bg-white shadow rounded-circle icon d-flex align-items-center justify-content-center"
              to="#"
              aria-label="Toggle Menu"
              onClick={() => props.setShow(!props.show)}
            >
              <i className="material-symbols-outlined text-primary fs-5 d-flex">
                menu
              </i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
