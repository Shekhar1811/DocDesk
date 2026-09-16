import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import dataServices from "../../apiServices/data.services";
import Loader from "../../components/Loader/Loader";
import { Can } from "../../context/AuthProvider";
import { Col, Form } from "react-bootstrap";
import Select from "react-select";
import { handleValidationError } from "../../components/CommonFunctions";

const Bill = () => {
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState();
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(null);

  const getInvoices = (patientId) => {
    setLoading(true);
    dataServices
      .getInvoices(patientId)
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
          label: patient.contact.name,
        }));
        setPatients(options);
      }
    });
  }, []);

  return (
    <div className="content-wrapper">
      <Can I="list" an="Invoice">
        <div>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-2 pb-1   fw-bold text-black">Invoice</h6>
              <a href="/add-invoice" className="btn btn-primary">
                Create Invoice
              </a>
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
                    onChange={(option) =>
                      setPatientId(option ? option.value : null)
                    }
                  />
                </Form.Group>
              </Col>
            </div>
            <br />
            <div className="list">
              {invoices
                ? invoices.toReversed().map((bill, index) => {
                    const { patient } = bill;
                    return (
                      <Can I="read" an="Invoice" passThrough key={index}>
                        {(allowed) => (
                          <a
                            disabled={!allowed}
                            href={`/invoice-details/${bill.id}`}
                            className="list-item"
                          >
                            <div className="w-100">
                              <div className="small">
                                <h6 className="mb-1 fs-14">{patient?.name}</h6>
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <small className="text-muted">
                                      <strong>RS:</strong> {bill.amount}
                                    </small>
                                  </div>
                                  <div>
                                    <small className="text-muted">
                                      <strong>ID:</strong> {bill.id}
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
                                      {bill.transaction_number}
                                    </small>
                                  </div>
                                </div>
                                <strong>Date:</strong>{" "}
                                <span>{bill.payment_date}</span>
                              </div>
                            </div>
                          </a>
                        )}
                      </Can>
                    );
                  })
                : loading && <Loader />}
            </div>
          </div>
        </div>
      </Can>
    </div>
  );
};

export default Bill;
