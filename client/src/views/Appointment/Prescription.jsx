import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, Table, Badge } from "react-bootstrap";
import Select from "react-select";
import dataServices from "../../apiServices/data.services";
import { useAlert } from "react-alert";
import {
  handleValidationError,
  showAlert,
} from "../../components/CommonFunctions";
import { Typeahead } from "react-bootstrap-typeahead";
import { useFormik } from "formik";
import PrescriptionPDFComponent from "./PrescriptionPDFComponent";
import { Link } from "react-router-dom";
import { Can } from "./../../context/AuthProvider";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Prescription = ({ appointment }) => {
  const [masterMedicines, setMasterMedicines] = useState();
  const [prescription, setPrescription] = useState([]);
  const [notes, setNotes] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [reload, setReload] = useState(true);
  const alert = useAlert();
  const [initialValues, setInitialValues] = useState({
    id: "",
    medicine: "",
    dosages: "",
    duration: "",
    qty: "",
    notes: "",
    type: "",
    instruction: "",
    appointment_id: appointment.id,
  });

  useEffect(() => {
    setLoading(true);
    dataServices
      .getPrescriptions(appointment.id)
      .then((res) => {
        if (res.status === 200) {
          setPrescription(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload, appointment.id]);

  useEffect(() => {
    dataServices
      .getMedicines()
      .then((res) => {
        if (res.status === 200) {
          setMasterMedicines(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      const api = editMode ? "editPrescriptions" : "addPrescriptions";
      const payload = [];
      if (editMode) {
        payload[0] = values.id;
        payload[1] = values;
      } else {
        payload[0] = values;
      }
      dataServices[api](...payload)
        .then((res) => {
          if (res.status === 201) {
            alert.success("Prescription added successfully");
            setPrescription([...prescription, formik.values]);
          } else if (res.status === 200) {
            alert.success("Prescription updated successfully");
            setEditMode(false);
            const updatedPrescription = prescription.filter(
              (pres) => pres.id !== values.id
            );
            setPrescription([...updatedPrescription, formik.values]);
          }
        })
        .catch((err) => {
          alert.error(handleValidationError(err));
          setLoading(false);
        })
        .finally(() => {
          setInitialValues({
            id: "",
            medicine: "",
            dosages: "",
            duration: "",
            qty: "",
            notes: "",
            type: "",
            instruction: "",
            appointment_id: appointment.id,
          });
          setLoading(false);
          setReload(!reload);
        });
    },
  });

  const optionsTime = [
    { value: "One time", label: "Once daily" },
    { value: "Two times", label: "Twice daily" },
    { value: "Three times", label: "Thrice daily" },
    { value: "Four times", label: "Four times daily" },
  ];

  const optionsMeal = [
    { value: "After Meal", label: "After Meal" },
    { value: "Before Meal", label: "Before Meal" },
    { value: "Before  Bed time", label: "Before  Bed time" },
  ];

  const optionsQty = [
    { value: "1", label: "1" },
    { value: "1/2", label: "1/2" },
  ];

  const optionsDuration = Array.from({ length: 31 }, (_, i) => ({
    value: `${i + 1} day${i > 0 ? "s" : ""}`,
    label: `${i + 1} day${i > 0 ? "s" : ""}`,
  }));

  const checkIfMedExists = (name) => {
    const existingPatient = masterMedicines.find(
      (med) => med.name.toLowerCase() === name.toLowerCase()
    );
    if (existingPatient) {
      return true;
    }
    return false;
  };

  const handleDelete = (id) => {
    dataServices.deletePrescription(id).then((res) => {
      if (res.status === 200) {
        setPrescription(prescription.filter((pres) => pres.id !== id));
        alert.success("Prescription deleted successfully");
      } else {
        alert.error("Failed to delete prescription");
      }
    });
  };

  const handleEdit = (id) => {
    const values = prescription.filter((pres) => pres.id === id)[0];
    setInitialValues({
      id: values.id,
      medicine: values.medicine,
      dosages: values.dosages,
      duration: values.duration,
      qty: values.qty,
      notes: values.notes,
      type: values.type,
      instruction: values.instruction,
      appointment_id: appointment.id,
    });
    setEditMode(true);
  };

  const printDocument = () => {
    const input = document.getElementById("divToPrint");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("prescription.pdf");
    });
  };

  return (
    <>
      <Can I="list" a="Prescription">
        <div className="d-flex justify-content-between">
          <div>
            <strong>Prescription Details</strong>
          </div>
          <div>
            {prescription.length > 0 && (
              <Row className="d-flex">
                <Col className="text-end">
                  <Button
                    variant="primary"
                    onClick={() => (!show ? printDocument() : setShow(false))}
                    size="sm"
                  >
                    {!show ? "Print" : "Print preview"}
                  </Button>
                  {!show && (
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={() => setShow(true)}
                      size="sm"
                    >
                      Close
                    </Button>
                  )}
                </Col>
              </Row>
            )}
          </div>
        </div>
        <br />
      </Can>
      {show ? (
        <>
          <Can I="list" a="Prescription">
            <div className="card">
              <div className="card-body">
                <Table border>
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Duration</th>
                      {/* <th>Qty</th> */}
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.length > 0 &&
                      prescription.map((pres) => (
                        <tr key={pres.id}>
                          <td>
                            {pres.medicine}
                            <br />
                            <Badge>{pres.type}</Badge> <br />
                            <small>
                              {pres.dosages} {pres.instruction}
                            </small>
                          </td>
                          <td>{pres.duration}</td>
                          {/* <td>{pres.qty}</td> */}
                          <td>
                            <Can I="edit" a="Prescription">
                              <Link
                                className="delete-icon"
                                onClick={() => handleEdit(pres.id)}
                              >
                                <span className="material-symbols-outlined h2 m-0">
                                  edit
                                </span>
                              </Link>
                            </Can>
                            <Can I="delete" a="Prescription">
                              <Link
                                className="delete-icon"
                                onClick={() =>
                                  showAlert("Note", handleDelete, pres.id)
                                }
                              >
                                <span className="material-symbols-outlined text-danger">
                                  delete
                                </span>
                              </Link>
                            </Can>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <br /> <br />
          </Can>
          <Can I="add" a="Prescription">
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col xs={12} className="form-group">
                  <Form.Label htmlFor="medicine">Medicine</Form.Label>
                  <Typeahead
                    id="medicine"
                    onChange={(selected) => {
                      if (selected.length > 0) {
                        formik.setFieldValue("medicine", selected[0]);
                        const med = masterMedicines.find(
                          (option) => option.name === selected[0]
                        );
                        formik.setFieldValue("type", med ? med.type : null);
                      }
                    }}
                    options={masterMedicines?.map((med) => med.name)}
                    placeholder="Select or type a name"
                    onBlur={(e) => {
                      if (!checkIfMedExists(e.target.value)) {
                        formik.setFieldValue("medicine", e.target.value);
                      }
                    }}
                    /* isInvalid={
                    formik.touched.contact?.name && !!formik.errors.contact?.name
                  } */
                  />
                  {/*  {formik.touched.contact?.name && formik.errors.contact?.name && (
                  <div className="invalid-feedback">
                    {formik.errors.contact.name}
                  </div>
                )} */}
                </Col>
                <Col xs={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Dosages</Form.Label>
                    <Select
                      options={optionsTime}
                      value={
                        optionsTime.find(
                          (option) => option.value === formik.values.dosages
                        ) || null
                      }
                      onChange={(option) =>
                        formik.setFieldValue("dosages", option.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Instruction</Form.Label>
                    <Select
                      options={optionsMeal}
                      value={
                        optionsMeal.find(
                          (option) => option.value === formik.values.instruction
                        ) || null
                      }
                      onChange={(option) =>
                        formik.setFieldValue("instruction", option.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Qty</Form.Label>
                    <Select
                      options={optionsQty}
                      value={
                        optionsQty.find(
                          (option) => option.value === formik.values.qty
                        ) || null
                      }
                      onChange={(option) =>
                        formik.setFieldValue("qty", option.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Duration</Form.Label>
                    <Select
                      options={optionsDuration}
                      value={
                        optionsDuration.find(
                          (option) => option.value === formik.values.duration
                        ) || null
                      }
                      onChange={(option) =>
                        formik.setFieldValue("duration", option.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} className="form-group">
                  <Form.Label htmlFor="notes">notes</Form.Label>
                  <Typeahead
                    id="notes"
                    onChange={(selected) => {
                      if (selected.length > 0) {
                        formik.setFieldValue("notes", selected[0]);
                      }
                    }}
                    options={notes?.map((note) => note.name)}
                    placeholder="Select or type a name"
                    onBlur={(e) => {
                      if (!checkIfMedExists(e.target.value)) {
                        formik.setFieldValue("notes", e.target.value);
                      }
                    }}
                    /* isInvalid={
                    formik.touched.contact?.name && !!formik.errors.contact?.name
                  } */
                  />
                  {/*  {formik.touched.contact?.name && formik.errors.contact?.name && (
                  <div className="invalid-feedback">
                    {formik.errors.contact.name}
                  </div>
                )} */}
                </Col>
              </Row>
              {!editMode ? (
                <Button type="submit" disabled={loading} className="">
                  Add
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="">
                  Save
                </Button>
              )}
            </Form>
          </Can>
        </>
      ) : (
        <PrescriptionPDFComponent
          prescriptions={prescription}
          appointment={appointment}
        />
      )}
    </>
  );
};

export default Prescription;
