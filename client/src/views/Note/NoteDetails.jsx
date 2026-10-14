import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAlert } from "react-alert";
import dataServices from "../../apiServices/data.services";
import { handleValidationError } from "./../../components/CommonFunctions";
import Loader from "./../../components/Loader/Loader";
import { Can } from "./../../context/AuthProvider";
import moment from "moment-timezone";

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
        <Link
          to="/note"
          className="icon-link p-2 btn-outline-primary text-decoration-none d-inline-flex align-items-center mb-2"
        >
          <span className="material-symbols-outlined me-1">arrow_back</span>
          Back to Notes
        </Link>
        {note ? (
          <div>
            <div
              className="bg-white rounded-4 px-4 py-4 overflow-hidden mb-3 shadow-sm"
              style={{ minWidth: 0, maxWidth: "100%", wordBreak: "break-word" }}
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 p-2 me-2 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 40, height: 40 }}
                    >
                      <span className="material-symbols-outlined text-primary fs-5">clinical_notes</span>
                    </div>
                    <h5
                      className="fw-bold mb-0 text-dark"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        minWidth: 0,
                      }}
                    >
                      {note.title || note.name}
                    </h5>
                  </div>

                  {note.date && (
                    <div className="d-flex align-items-center text-muted small mb-3 ms-1">
                      <span className="material-symbols-outlined me-1 fs-6">calendar_today</span>
                      <span>Recorded on {moment(note.date).format("DD-MM-YYYY")}</span>
                    </div>
                  )}

                  <div
                    className="p-3 bg-light rounded-3 text-secondary mt-3"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      lineHeight: 1.6,
                      fontSize: "14px",
                      minWidth: 0,
                    }}
                  >
                    {note.description || note.name || "No description provided."}
                  </div>
                </div>

                <Can I="edit" a="Note">
                  <Link to={`/edit-note/${note.id}`} className="link-dark flex-shrink-0" title="Edit Note">
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
