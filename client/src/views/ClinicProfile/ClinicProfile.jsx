import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "./../../components/Loader/Loader";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import Image from "react-bootstrap/Image";
import tokenService from "../../apiServices/token.service";
import { Can } from "./../../context/AuthProvider";
import { IMAGE_URL } from "../../constants";

const ClinicProfile = () => {
  const [clinicData, setClinicData] = useState();
  const [loading, setLoading] = useState(false);
  const user = tokenService.getUser();
  const clinicId = user?.clinic?.id || 1;
  const alert = useAlert();
  useEffect(() => {
    setLoading(true);
    dataServices
      .getClinic(clinicId)
      .then((res) => {
        if (res.status === 200) {
          setClinicData(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [clinicId]);
  return (
    <Can I="read" this="Clinic">
      <div className="content-wrapper">
        <div>
          <div className="bg-white rounded-4 px-3  mt-4 pt-3 overflow-hidden edit-profile-back   mb-3">
            <h6 className="pb-2">Clinic Info</h6>
            {clinicData ? (
              <>
                <div className="d-flex">
                  <div className="col">
                    <p>
                      <span className="text-muted small">Clinic Name</span>
                      <br />
                      {clinicData?.name}
                    </p>
                  </div>
                  <div className="col">
                    <p>
                      <span className="text-muted small">
                        Registration Number
                      </span>
                      <br />
                      {clinicData?.number}
                    </p>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="col">
                    <p>
                      <span className="text-muted small">
                        Registration Date
                      </span>
                      <br />
                      {clinicData?.registration_date}
                    </p>
                  </div>
                  <div className="col">
                    <p>
                      <span className="text-muted small">GST No</span>
                      <br />
                      {clinicData?.gst_number}
                    </p>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="col">
                    <p>
                      <span className="text-muted small">Phone</span>
                      <br />
                      {clinicData?.phone}
                    </p>
                  </div>
                  <div className="col">
                    <p>
                      <span className="text-muted small">Email</span>
                      <br />
                      {clinicData?.email}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="col">
                    <p>
                      <span className="text-muted small">Address</span>
                      <br />
                      {clinicData?.address?.line1 ? `${clinicData.address.line1}, ` : ""}
                      {clinicData?.address?.city || ""}{clinicData?.address?.state ? `, ${clinicData.address.state}` : ""}
                      {clinicData?.address?.zipcode ? ` - ${clinicData.address.zipcode}` : ""}
                    </p>
                  </div>
                </div>
                <div className="row">
                  {clinicData?.logo?.url && (
                    <div className="col">
                      <p>
                        <span className="text-muted small">Clinic Logo</span>
                        <br />
                        <Image
                          src={IMAGE_URL + clinicData.logo.url}
                          rounded
                          fluid
                          className="logo-img"
                        />
                      </p>
                    </div>
                  )}
                  {clinicData?.favicon?.url && (
                    <div className="col">
                      <p>
                        <span className="text-muted small">Clinic Favicon</span>
                        <br />
                        <Image
                          src={IMAGE_URL + clinicData.favicon.url}
                          rounded
                          fluid
                          className="logo-img"
                        />
                      </p>
                    </div>
                  )}
                  {clinicData?.scanner?.url && (
                    <div className="col">
                      <p>
                        <span className="text-muted small">Clinic Scanner</span>
                        <br />
                        <Image
                          src={IMAGE_URL + clinicData.scanner.url}
                          rounded
                          fluid
                          className="logo-img"
                        />
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              loading && <Loader />
            )}
            <Can I="edit" this="Clinic">
              <Link to="/edit-clinic-profile" className="link-dark">
                <div className="edit-profile-icon bg-primary text-white">
                  <span className="material-symbols-outlined h2 m-0">edit</span>
                </div>
              </Link>
            </Can>
          </div>
        </div>
      </div>
    </Can>
  );
};

export default ClinicProfile;
