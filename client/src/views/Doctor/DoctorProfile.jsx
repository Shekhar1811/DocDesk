import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  useEffect(() => {
    setLoading(true);
    dataServices
      .getDoctorDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setDoctor(res.data);
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
      <div className="bg-white rounded-4  mt-4 px-3 pt-3 overflow-hidden edit-profile-back   mb-3">
        <Can I="read" a="Doctor">
          <div>
            {doctor ? (
              <>
                <Card.Title as="h6" className="pb-2">
                  Doctor Info
                </Card.Title>
                <Row className="mb-3">
                  <Col>
                    <p>
                      <span className="text-muted small">Name</span>
                      <br />
                      {doctor.contact.first_name +
                        " " +
                        doctor.contact.last_name}
                    </p>
                  </Col>
                  <Col>
                    <p>
                      <span className="text-muted small">Date of Birth</span>
                      <br />
                      {doctor.date_of_birth}
                    </p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <p>
                      <span className="text-muted small">Gender</span>
                      <br />
                      {doctor.gender}
                    </p>
                  </Col>
                  <Col>
                    <p>
                      <span className="text-muted small">Phone</span>
                      <br />
                      {doctor.contact.mobile}
                    </p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <p>
                      <span className="text-muted small">Email</span>
                      <br />
                      {doctor.contact.email}
                    </p>
                  </Col>
                 
                </Row>
                <Row className="mb-3">
                <Col>
                    <p>
                      <span className="text-muted small">Employee ID</span>
                      <br />
                      {doctor.id}
                    </p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <p>
                      <span className="text-muted small">Address</span>
                      <br />
                      {`${
                        doctor?.address?.line1 ? doctor?.address?.line1 : ""
                      }  ${
                        doctor?.address?.city ? doctor?.address?.city : ""
                      } ${
                        doctor?.address?.zipcode ? doctor?.address?.zipcode : ""
                      }`}
                    </p>
                  </Col>
                </Row>
                {/* <Row className="mb-3">
                  <Col>
                    <p>
                      <span className="text-muted small">Password</span>
                      <br />
                      SSDSSSSSS
                    </p>
                  </Col>
                  <Col>
                    <Link to="#">
                      <span className="text-muted small">Change password</span>
                      <br />
                    </Link>
                  </Col>
                </Row> */}
                <Can I="edit" this="Doctor">
                  <Link to={`/edit-doctor/${id}`} className="link-dark">
                    <div className="edit-profile-icon bg-primary text-white">
                      <span className="material-symbols-outlined h2 m-0">edit</span> 
                    </div>
                  </Link>
                </Can>
              </>
            ) : (
              loading && <Loader />
            )}
          </div>
        </Can>
      </div>
    </div>
  );
};

export default DoctorProfile;
