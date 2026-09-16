import React, { useRef, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { handleValidationError } from "../CommonFunctions";
import { useAlert } from "react-alert";
import dataServices from "../../apiServices/data.services";
import { IMAGE_URL } from "../../constants";
import { Link } from "react-router-dom";
import { Loader } from "react-bootstrap-typeahead";

const AssetsView = ({ id, assets, editApi = null, setReload }) => {
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const removeUploadedFiles = (fileId) => {
    setLoading(true);
    const payload = { assets: [{ id: fileId, destroy: true }] };
    dataServices[editApi](id, payload)
      .then((res) => {
        if (res.status === 200) {
          alert.success("File deleted successfully");
          setReload((prev) => !prev);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container className="mt-4">
      {assets && assets.length > 0 && (
        <>
          <Row className="mt-4">
            {assets &&
              assets.map((imgObj, i) => {
                const type = imgObj.mime_type
                  ? imgObj.mime_type.slice(-3)
                  : null;
                const fileURL = IMAGE_URL + imgObj.url;
                return (
                  <Col
                    key={i}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    className="position-relative text-center"
                    style={{ maxWidth: "120px" }}
                  >
                    <p>{imgObj?.type}</p>

                    <Link to={fileURL} target="_blank">
                      {type === "pdf" ? (
                        <img
                          src="/img/pdf-icon.png"
                          alt={imgObj.file_name}
                          className="img-thumbnail"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={fileURL}
                          alt={imgObj.file_name}
                          className="img-thumbnail"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Link>
                    {!loading && editApi && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="delete-img-btn"
                        onClick={() => removeUploadedFiles(imgObj.id)}
                        disabled={loading}
                        style={{
                          cursor: loading ? "not-allowed" : "pointer",
                        }}
                      >
                        &times;
                      </Button>
                    )}
                  </Col>
                );
              })}
          </Row>
        </>
      )}
    </Container>
  );
};

export default AssetsView;
