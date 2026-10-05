import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAlert } from "react-alert";
import dataServices from "../../apiServices/data.services";
import { handleValidationError } from "./../../components/CommonFunctions";
import Loader from "./../../components/Loader/Loader";
import { Can } from "./../../context/AuthProvider";

const NoteDetails = () => {
  const { id } = useParams();
  const [note, setNote] = useState();
  const alert = useAlert();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dataServices
      .getNoteDetails(id)
      .then((res) => {
        if (res.status === 200) {
          setNote(res.data);
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
      <Can I="read" a="Note">
        {note ? (
          <div>
            <div className="bg-white rounded-4 px-4 py-4 mt-4 overflow-hidden edit-profile-back mb-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold mb-2 text-dark">{note.title || note.name}</h5>
                  <p className="text-secondary mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {note.description || note.name || "No description provided."}
                  </p>
                </div>
                <Can I="edit" a="Note">
                  <Link to={`/edit-note/${note.id}`} className="link-dark ms-3">
                    <div className="edit-profile-icon bg-primary text-white">
                      <span className="material-symbols-outlined h2 m-0">
                        edit
                      </span>
                    </div>
                  </Link>
                </Can>
              </div>
            </div>
          </div>
        ) : (
          loading && <Loader />
        )}
      </Can>
    </div>
  );
};

export default NoteDetails;
