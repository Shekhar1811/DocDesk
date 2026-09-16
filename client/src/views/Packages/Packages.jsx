import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import {
  handleValidationError,
  showAlert,
} from "../../components/CommonFunctions";
import { Can } from "../../context/AuthProvider";

const Packages = () => {
  const [packages, setPackages] = useState();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getPackages()
      .then((res) => {
        if (res.status === 200) {
          setPackages(res.data);
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
    dataServices.deletePackage(id).then((res) => {
      if (res.status === 200) {
        const updatedPackages = packages.filter((pkg) => pkg.id !== id);
        setPackages(updatedPackages);
        alert.success("Package deleted successfully");
      } else {
        alert.error("Failed to delete package");
      }
    });
  };

  return (
    <div className="content-wrapper">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-2 pb-1 px-3 fw-bold text-black">
            Service Packages
          </h6>
          <Can I="add" this="Package">
            <a href="/add-packages" className="btn btn-primary">
              Add Package
            </a>
          </Can>
        </div>
        <Can I="list" this="Package">
          <div className="list">
            {packages ? (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="list-item d-flex justify-content-between align-items-center"
                >
                  <Can I="read" this="Package" passThrough>
                    {(allowed) => (
                      <a
                        href={`/packages-details/${pkg.id}`}
                        disabled={!allowed}
                        className="w-100"
                      >
                        <div>
                          <h6 className="mb-1 fs-14">{pkg.name}</h6>
                          <small className="text-muted">
                            {pkg.description}
                          </small>
                          <br />
                          <strong>Price:</strong> <span>{pkg.amount}</span>/-
                        </div>
                      </a>
                    )}
                  </Can>
                  <Can I="delete" this="Package">
                    <Link
                      className="delete-icon"
                      onClick={() => showAlert("Package", handleDelete, pkg.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </Link>
                  </Can>
                </div>
              ))
            ) : loading ? (
              <Loader />
            ) : (
              <p>No packages found</p>
            )}
          </div>
        </Can>
      </div>
    </div>
  );
};

export default Packages;
