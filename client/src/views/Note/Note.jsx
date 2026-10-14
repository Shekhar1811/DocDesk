import React, { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import dataServices from "../../apiServices/data.services";
import {
  handleValidationError,
  showAlert,
} from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";
import moment from "moment-timezone";

const Note = () => {
  const [notes, setNotes] = useState();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getNotes()
      .then((res) => {
        if (res.status === 200) {
          setNotes(res.data);
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
    dataServices.deleteNote(id).then((res) => {
      if (res.status === 200) {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        alert.success("Note deleted successfully");
      } else {
        alert.error("Failed to delete note");
      }
    });
  };

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-2 pb-1 fw-bold text-black">Notes</h6>
        <Can I="add" a="Note">
          <Link to="/add-note" className="btn btn-primary">
            Add Note
          </Link>
        </Can>
      </div>
      <Can I="list" a="Note">
        {loading ? (
          <Loader fullPage />
        ) : (
          <div className="row g-3">
            {notes && notes.length > 0 ? (
              notes.map((note) => (
                <div className="col-12 col-md-6 col-lg-4" key={note.id}>
                  <div
                    className="card h-100 shadow-sm border-0 rounded-4 p-3 position-relative bg-white"
                    style={{ minWidth: 0, overflow: "hidden" }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center me-2" style={{ minWidth: 0, flex: 1 }}>
                        <div
                          className="rounded-circle bg-primary bg-opacity-10 p-2 me-2 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 36, height: 36 }}
                        >
                          <span className="material-symbols-outlined text-primary fs-5">clinical_notes</span>
                        </div>
                        <Can I="read" a="Note" passThrough>
                          {(allowed) => (
                            <Link
                              disabled={!allowed}
                              to={`/note-details/${note.id}`}
                              className="text-decoration-none text-dark fw-bold text-truncate d-block"
                              title={note.title || note.name}
                              style={{ minWidth: 0, flex: 1 }}
                            >
                              {note.title || note.name}
                            </Link>
                          )}
                        </Can>
                      </div>

                      <Can I="delete" a="Note">
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0 border-0 flex-shrink-0"
                          onClick={() => showAlert("Note", handleDelete, note.id)}
                          title="Delete note"
                          style={{
                            width: 28,
                            height: 28,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span className="material-symbols-outlined fs-5">delete</span>
                        </button>
                      </Can>
                    </div>

                    <Can I="read" a="Note" passThrough>
                      {(allowed) => (
                        <Link
                          disabled={!allowed}
                          to={`/note-details/${note.id}`}
                          className="text-decoration-none text-secondary d-block flex-grow-1"
                          style={{ minWidth: 0 }}
                        >
                          <p
                            className="mb-0 small text-muted"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                              lineHeight: 1.5,
                            }}
                          >
                            {note.description || note.name || "No description provided."}
                          </p>
                        </Link>
                      )}
                    </Can>

                    {note.date && (
                      <div
                        className="mt-2 pt-2 border-top d-flex align-items-center text-muted small"
                        style={{ fontSize: "12px" }}
                      >
                        <span className="material-symbols-outlined me-1 fs-6">calendar_today</span>
                        <span>{moment(note.date).format("DD-MM-YYYY")}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-center py-5 bg-white rounded-4 shadow-sm text-muted">
                  <span className="material-symbols-outlined display-4 text-muted mb-2 d-block">note_stack</span>
                  <p className="m-0">No notes found</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Can>
    </div>
  );
};

export default Note;
