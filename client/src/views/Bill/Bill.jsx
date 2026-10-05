import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";
import { Col, Form } from "react-bootstrap";
import Select from "react-select";
import { handleValidationError } from "../../components/CommonFunctions";
import { Link, useSearchParams } from "react-router-dom";

const Bill = () => {
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState();
  const [patients, setPatients] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPatientId = searchParams.get("patient_id") ? parseInt(searchParams.get("patient_id")) : null;
  const [patientId, setPatientId] = useState(urlPatientId);

  useEffect(() => {
    if (urlPatientId !== patientId) {
      setPatientId(urlPatientId);
    }
  }, [urlPatientId]);

  const getInvoices = (pid) => {
    setLoading(true);
    dataServices
      .getInvoices(pid)
      .then((res) => {
        if (res.status === 200) {
          setInvoices(res.data);
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInvoices(patientId);
  }, [patientId]);

  useEffect(() => {
    dataServices.getPatients().then((res) => {
      if (res.status === 200) {
        const options = res.data.map((patient) => ({
          value: patient.id,
          label: patient.contact?.name || `${patient.contact?.first_name || ""} ${patient.contact?.last_name || ""}`.trim() || `Patient #${patient.id}`,
        }));
        setPatients(options);
      }
    });
  }, []);

  const handlePatientSelect = (option) => {
    const val = option ? option.value : null;
    setPatientId(val);
    if (val) {
      setSearchParams({ patient_id: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="content-wrapper">
      <Can I="list" an="Invoice">
        <div>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-2 pb-1 fw-bold text-black">Invoices</h6>
              <Link to="/add-invoice" className="btn btn-primary">
                Create Invoice
              </Link>
            </div>
            <div>
              <Col>
                <Form.Group className="form-group">
                  <Form.Label>Select Patient</Form.Label>
                  <Select
                    id="patient"
                    isClearable={true}
                    name="patient_id"
                    options={patients}
                    value={
                      patientId
                        ? patients.find(
                            (patient) => patientId === patient.value
                          )
                        : null
                    }
                    onChange={handlePatientSelect}
                  />
                </Form.Group>
              </Col>
            </div>
            <br />
            <div className="list">
              {invoices && invoices.length > 0 ? (
                invoices.toReversed().map((bill) => {
                  const { patient } = bill;
                  return (
                    <Can I="read" an="Invoice" passThrough key={bill.id}>
                      {(allowed) => (
                        <Link
                          disabled={!allowed}
                          to={`/invoice-details/${bill.id}`}
                          className="list-item text-decoration-none"
                        >
                          <div className="w-100">
                            <div className="small">
                              <h6 className="mb-1 fs-14 text-dark">{patient?.name || `Patient #${bill.patient_id}`}</h6>
                              <div className="d-flex justify-content-between">
                                <div>
                                  <small className="text-muted">
                                    <strong>Amount:</strong> ₹{bill.amount}
                                  </small>
                                </div>
                                <div>
                                  <small className="text-muted">
                                    <strong>ID:</strong> #{bill.id}
                                  </small>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <div>
                                  <small className="text-muted">
                                    <strong>By:</strong> {bill.paid_by}
                                  </small>
                                </div>
                                <div>
                                  <small className="text-muted">
                                    <strong>Transaction ID:</strong>{" "}
                                    {bill.transaction_number || "N/A"}
                                  </small>
                                </div>
                              </div>
                              <strong>Date:</strong>{" "}
                              <span>{bill.payment_date}</span>
                            </div>
                          </div>
                        </Link>
                      )}
                    </Can>
                  );
                })
              ) : loading ? (
                <Loader />
              ) : (
                <div className="text-center py-4 text-muted">
                  <p className="m-0">No invoices found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Can>
    </div>
  );
};

export default Bill;
