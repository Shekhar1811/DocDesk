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
        <h6 className="mb-2 pb-1 fw-bold text-black">Note</h6>
        <Can I="add" a="Note">
          <Link to="/add-note" className="btn btn-primary">
            Add Note
          </Link>
        </Can>
      </div>
      <Can I="list" a="Note">
        <div className="list">
          {notes ? (
            notes.map((note) => (
              <div className="list-item ">
                <Can I="read" a="Note" passThrough>
                  {(allowed) => (
                    <Link
                      disabled={!allowed}
                      to={`/note-details/${note.id}`}
                      className="d-flex "
                    >
                      <div className="list-item-content">
                        <div className="d-flex justify-content-between">
                          <p>{note.name}</p>
                        </div>
                      </div>
                    </Link>
                  )}
                </Can>

                <Can I="delete" a="Note">
                  <Link
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
            <p>No packages found</p>
          )}
        </div>
      </Can>
    </div>
  );
};

export default Note;
