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
        <div className="list">
          {notes && notes.length > 0 ? (
            notes.map((note) => (
              <div className="list-item mb-2" key={note.id}>
                <Can I="read" a="Note" passThrough>
                  {(allowed) => (
                    <Link
                      disabled={!allowed}
                      to={`/note-details/${note.id}`}
                      className="d-flex text-decoration-none"
                    >
                      <div className="list-item-content">
                        <div className="d-flex flex-column">
                          <p className="fw-semibold mb-1 text-dark">{note.title || note.name}</p>
                          {note.description && (
                            <small className="text-muted text-truncate d-block">{note.description}</small>
                          )}
                        </div>
                      </div>
                    </Link>
                  )}
                </Can>

                <Can I="delete" a="Note">
                  <Link
                    to="#"
                    className="delete-icon"
                    onClick={() => showAlert("Note", handleDelete, note.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </Link>
                </Can>
              </div>
            ))
          ) : loading ? (
            <Loader />
          ) : (
            <div className="text-center py-4 text-muted">
              <p className="m-0">No notes found</p>
            </div>
          )}
        </div>
      </Can>
    </div>
  );
};

export default Note;
