import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAlert } from "react-alert";
import { useEffect } from "react";
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
            <div className="bg-white rounded-4 px-3 mt-4 pt-3 overflow-hidden edit-profile-back mb-3">
              <h6 className="pb-2">Note Info</h6>
              <div className="d-flex">
                <div className="col">
                  <p>{note.name}</p>
                </div>
              </div>
              <Can I="edit" a="Note">
                <a href={`/edit-note/${note.id}`} className="link-dark">
                  <div className="edit-profile-icon bg-primary text-white">
                    <span className="material-symbols-outlined h2 m-0">
                      edit
                    </span>
                  </div>
                </a>
              </Can>
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
