import React, { useRef, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { handleValidationError } from "../CommonFunctions";
import { useAlert } from "react-alert";
import dataServices from "../../apiServices/data.services";
import { IMAGE_URL } from "../../constants";
import { Link } from "react-router-dom";
import { Loader } from "react-bootstrap-typeahead";

const FileUpload = ({ id, onSubmit, uploadApi, setReload }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onSubmit) {
        onSubmit(e.target.files);
        setFiles([...e.target.files]);
      } else {
        setFiles((prev) => {
          return prev.length > 0
            ? [...prev, ...e.target.files]
            : [...e.target.files];
        });
      }
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.length > 1
        ? prevFiles.filter((_, index) => index !== indexToRemove)
        : []
    );
  };

  const handleSubmit = () => {
    if (files) {
      setLoading(true);

      const formData = new FormData();
      files.forEach((file, i) => {
        formData.append(`assets[${i}]`, file);
      });

      dataServices[uploadApi](id, formData)
        .then((res) => {
          if (res.status === 200) {
            alert.success("File uploaded successfully");
            setReload((prev) => !prev);
            setFiles([]);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      alert.error("Please select a valid image file.");
    }
  };

  return (
    <Container className="mt-4">
      <Form.Group controlId="formFileMultiple">
        <Form.Label>Upload {onSubmit ? "an Image" : "Files"}</Form.Label>
        <Form.Control
          ref={fileInputRef}
          type="file"
          accept={onSubmit ? "image/*" : ".jpg,.jpeg,.png,.gif,.pdf"}
          multiple={!onSubmit}
          onChange={handleFileChange}
        />
      </Form.Group>
      {files && files.length > 0 && (
        <div className="mt-4">
          <p>Uploading File{files.length > 1 ? "s" : ""}:</p>
          <Row className="g-3">
            {files &&
              files.map((file, index) => {
                const fileURL = URL.createObjectURL(file);
                return (
                  <Col
                    key={index}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    className="position-relative text-center"
                    style={{ maxWidth: "120px" }}
                  >
                    {file.type.startsWith("image/") ? (
                      <img
                        src={fileURL}
                        alt={file.name}
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src="/img/pdf-icon.png"
                        alt="pdf-icon"
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    {!loading && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="delete-img-btn"
                        onClick={() => handleRemoveFile(index)}
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
        </div>
      )}
      {!onSubmit && (
        <Button
          variant="primary"
          className="mt-4"
          onClick={handleSubmit}
          disabled={files?.length === 0 || loading}
        >
          {loading ? <Loader /> : "Submit Files"}
        </Button>
      )}
    </Container>
  );
};

export default FileUpload;
