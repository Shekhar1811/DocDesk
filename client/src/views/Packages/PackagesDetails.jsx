import React, { useEffect, useState } from "react";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { useParams } from "react-router-dom";
import { Can } from "../../context/AuthProvider";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";

const PackagesDetails = () => {
  const { id } = useParams();
  const [servicePackage, setServicePackage] = useState();
  const alert = useAlert();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dataServices
      .getPackageDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setServicePackage(res.data);
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
        <Can I="read" this="Package">
          <div className="bg-white rounded-4 px-3  mt-4 pt-3 overflow-hidden edit-profile-back   mb-3">
            <h6 className="pb-2">Packages Info</h6>
            {servicePackage ? (
              <>
                <div className="d-flex">
                  <div className="col">
                    <p>
                      <span className="text-muted small">Packages Name</span>
                      <br />
                      {servicePackage.name}
                    </p>
                  </div>
                  <div className="col">
                    <p>
                      <span className="text-muted small">Price</span>
                      <br />
                      {servicePackage.amount}
                      <span>/-</span>
                    </p>
                  </div>
                  
                </div>
                <div className="d-flex">
                  <div className="col">
                      <p>
                        <span className="text-muted small">Seatings</span>
                        <br />
                        {servicePackage.seating_count}
                      </p>
                    </div>
                </div>
                <div className="d-flex">
                  <div className="col">
                    <p>
                      <span className="text-muted small">Descriptions</span>
                      <br />
                      <span>{servicePackage.description}</span>
                    </p>
                  </div>
                </div>
                <Can I="edit" this="Package">
                  <a
                    href={`/edit-packages/${servicePackage.id}`}
                    className="link-dark"
                  >
                    <div className="edit-profile-icon bg-primary text-white">
                      <span className="material-symbols-outlined h2 m-0">edit</span> 
                    </div>
                  </a>
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

export default PackagesDetails;
