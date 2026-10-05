import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import { useAlert } from "react-alert";
import { handleValidationError } from "../../components/CommonFunctions";
import Loader from "../../components/Loader/Loader";
import { Can } from "./../../context/AuthProvider";

const MedicinesDetails = () => {
  const { id } = useParams();
  const [med, setMed] = useState();
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getMedicineDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setMed(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="content-wrapper">
      <Can I="read" a="Medicine">
        {med ? (
          <div className="bg-white rounded-4 px-3 mt-4 pt-3 overflow-hidden edit-profile-back mb-3">
            <h6 className="pb-2">Medicines Info</h6>
            <div className="d-flex">
              <div className="col">
                <p>
                  <span className="text-muted small">Medicines Name</span>
                  <br />
                  {med.name}
                </p>
              </div>
              <div className="col">
                <p>
                  <span className="text-muted small">Medicines Type</span>
                  <br />
                  {med?.type}
                </p>
              </div>
            </div>
            <Can I="edit" a="Medicine">
              <Link
                to={`/edit-medicines/${id}`}
                state={med}
                className=""
              >
                <div className="edit-profile-icon bg-primary text-white">
                  <span className="material-symbols-outlined h2 m-0">edit</span>
                </div>
              </Link>
            </Can>
          </div>
        ) : (
          loading && <Loader />
        )}
      </Can>
    </div>
  );
};

export default MedicinesDetails;
