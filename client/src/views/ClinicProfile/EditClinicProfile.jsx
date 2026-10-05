import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import dataServices from "../../apiServices/data.services";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Loader from "../../components/Loader/Loader";
import tokenService from "../../apiServices/token.service";
import { useAlert } from "react-alert";
import FileUpload from "../../components/FileUploader/FileUpload";
import { handleValidationError } from "./../../components/CommonFunctions";
import { Can } from "../../context/AuthProvider";
import Select from "react-select";
import AssetsView from "../../components/FileUploader/AssetsView";

const EditClinicProfile = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState();
  const userData = tokenService.getUser();
  const alert = useAlert();
  const navigate = useNavigate();
  const [uploadTo, setUploadTo] = useState("logo");
  const uploadOptions = [
    {
      value: "logo",
      label: "Logo",
    },
    {
      value: "scanner",
      label: "QR Image",
    },
    {
      value: "favicon",
      label: "Favicon",
    },
  ];

  const clinicId = userData?.clinic?.id || 1;

  const getClinicProfile = () => {
    setLoading(true);
    dataServices
      .getClinic(clinicId)
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data);
          const updatedUserData = {
            ...userData,
            clinic: res.data,
          };
          tokenService.setUser(updatedUserData);
        } else {
          alert.error("Failed to fetch clinic details");
        }
      })
      .catch(() => {
        alert.error("An error occurred while fetching clinic details");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (clinicId) {
      getClinicProfile();
    }
  }, [clinicId]);

  const handleUpdateClinicData = () => {
    dataServices
      .getClinic(clinicId)
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data);
          const updatedUserData = {
            ...userData,
            clinic: res.data,
          };
          tokenService.setUser(updatedUserData);
          navigate("/clinic-profile");
          window.location.reload();
        } else {
          alert.error("Failed to fetch clinic details");
        }
      })
      .catch(() => {
        alert.error("An error occurred while fetching clinic details");
      })
      .finally(() => setLoading(false));
  };

  const validationSchema = Yup.object().shape({
    id: Yup.number().required("ID is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    registration_date: Yup.date().nullable(),
    address: Yup.object().shape({
      line1: Yup.string().required("Address line 1 is required"),
      city: Yup.string().required("City is required"),
      zipcode: Yup.string()
        .matches(/^\d{6}$/, "Zipcode must be exactly 6 digits")
        .required("Zipcode is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      registration_date: user?.registration_date || "",
      gst_number: user?.gst_number || "",
      number: user?.number || "",
      phone: user?.phone || "",
      address: {
        line1: user?.address.line1 || "",
        city: user?.address.city || "",
        zipcode: user?.address.zipcode || "",
      },
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (asset) {
        setLoading(true);
        dataServices
          .uploadClinicDocs(formik.values.id, asset.url, asset.image)
          .then((res) => {
            if (res.status === 200) {
              alert.success("Documents uploaded successfully");
            }
          })
          .catch((err) => {
            alert.error(handleValidationError(err));
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
            handleUpdateClinicData();
          });
      }
      if (formik.dirty) {
        setLoading(true);
        dataServices
          .editClinic(values.id, values)
          .then((res) => {
            if (res.status === 200) {
              alert.success("Clinic details updated successfully");
            }
          })
          .catch((err) => {
            alert.error(handleValidationError(err));
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
            handleUpdateClinicData();
          });
      }
    },
  });

  const handleCustomSubmit = (file) => {
    const formData = new FormData();
    formData.append(`${uploadTo}`, file[0]);
    setAsset({ url: uploadTo, image: formData });
  };

  return (
    <Can I="edit" this="Clinic">
      <div className="content-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="mb-2 pb-1 fw-bold text-black">
              Edit Clinic Profile
            </h6>
          </div>
        </div>
        {user ? (
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col xs={12} className="form-group">
                <Form.Label htmlFor="name">Clinic Name</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  {...formik.getFieldProps("name")}
                  placeholder="Enter clinic name"
                  isInvalid={formik.touched.name && formik.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Col>
              <Col xs={6} className="form-group">
                <Form.Label htmlFor="number">Registration No</Form.Label>
                <Form.Control
                  type="text"
                  id="number"
                  {...formik.getFieldProps("number")}
                  placeholder="Enter registration number"
                  isInvalid={formik.touched.number && formik.errors.number}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.number}
                </Form.Control.Feedback>
              </Col>
              <Col xs={6} className="form-group">
                <Form.Label htmlFor="gst_number">GST No</Form.Label>
                <Form.Control
                  type="text"
                  id="gst_number"
                  {...formik.getFieldProps("gst_number")}
                  placeholder="Enter GST number"
                  isInvalid={
                    formik.touched.gst_number && formik.errors.gst_number
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.gst_number}
                </Form.Control.Feedback>
              </Col>
              <Col xs={6} className="form-group">
                <Form.Label htmlFor="phone">Phone</Form.Label>
                <Form.Control
                  type="text"
                  id="phone"
                  {...formik.getFieldProps("phone")}
                  placeholder="Enter phone number"
                  isInvalid={formik.touched.phone && formik.errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </Col>
              <Col xs={6} className="form-group">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Enter email address"
                  isInvalid={formik.touched.email && formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Col>
              <Col sm={6} className="form-group">
                <Form.Label htmlFor="address_line1">Address Line-1</Form.Label>
                <Form.Control
                  type="text"
                  id="address_line1"
                  {...formik.getFieldProps("address.line1")}
                  placeholder="Locality/House/Street no."
                  isInvalid={
                    formik.touched.address?.line1 &&
                    formik.errors.address?.line1
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address?.line1}
                </Form.Control.Feedback>
              </Col>
              <Col xs={6} className="form-group">
                <Form.Label htmlFor="city">City</Form.Label>
                <Form.Control
                  type="text"
                  id="city"
                  {...formik.getFieldProps("address.city")}
                  placeholder="Enter city name"
                  isInvalid={
                    formik.touched.address?.city && formik.errors.address?.city
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address?.city}
                </Form.Control.Feedback>
              </Col>
              <Col xs={6} className="form-group">
                <Form.Label htmlFor="zipcode">Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  id="zipcode"
                  {...formik.getFieldProps("address.zipcode")}
                  placeholder="Enter postal code"
                  isInvalid={
                    formik.touched.address?.zipcode &&
                    formik.errors.address?.zipcode
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address?.zipcode}
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Form.Label htmlFor="upload-option">
                  Upload Image For
                </Form.Label>
                <Select
                  options={uploadOptions}
                  value={uploadOptions.find(
                    (option) => uploadTo === option.value
                  )}
                  onChange={(selectedOption) =>
                    selectedOption && setUploadTo(selectedOption.value)
                  }
                />
              </Col>
              <Col>
                <FileUpload
                  assets={user.assets}
                  onSubmit={handleCustomSubmit}
                />
              </Col>
            </Row>
            <Row>
              <AssetsView assets={user.assets} />
            </Row>
            <br />
            <div className="footer mt-auto">
              <Button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        ) : (
          loading && <Loader />
        )}
      </div>
    </Can>
  );
};

export default EditClinicProfile;
