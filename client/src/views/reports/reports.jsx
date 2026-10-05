import React, { useEffect, useState } from "react";
import dataServices from "../../apiServices/data.services";
import moment from "moment-timezone";
import Loader from "./../../components/Loader/Loader";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "react-select";
import { Button, Table, Row, Col, Form, Pagination } from "react-bootstrap";
import { handleValidationError } from "../../components/CommonFunctions";
import { useAlert } from "react-alert";
import { exportToExcel } from "../../components/ExportToExcel/ExportToExcel";
import { Can } from "./../../context/AuthProvider";

const Reports = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const alert = useAlert();

  const getReports = (startDate, endDate, paymentMethod, patientId) => {
    setLoading(true);
    dataServices
      .getReports(startDate, endDate, paymentMethod, patientId)
      .then((res) => {
        if (res.status === 200) {
          setReports(res.data);
        } else {
          alert.error("Error while getting reports");
        }
      })
      .catch((err) => {
        alert.error(handleValidationError(err));
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getReports();
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
  const handleFilter = () => {
    setCurrentPage(1);
    getReports(startDate, endDate, paymentMethod, patientId);
  };
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setPaymentMethod(null);
    setPatientId(null);
    getReports();
    setCurrentPage(1);
  };
  // Calculate the current reports
  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <Can I="list" this="Report">
      <div className="content-wrapper"> 
        <Row className="d-flex justify-content-between align-items-center mb-3">
          <Col>
            <h6 className="mb-2 pb-1 fw-bold text-black">Reports</h6>
          </Col>
          <Can I="read" this="Report">
            <Col className="text-end">
              <Button
                className="btn btn-primary"
                onClick={() => {
                  exportToExcel(reports);
                }}
              >
                Export Report
              </Button>
            </Col>
          </Can>
        </Row>
        <Row className="mb-3">
          <Col md={6} xs={12} className="mb-2 mb-md-0">
            <Form.Group>
              <Form.Label>Start Date:</Form.Label>
              <DatePicker
                name="start_date"
                value={startDate ? moment(startDate) : moment(new Date())}
                format="DD-MM-YYYY"
                maxDate={moment(new Date())}
                onChange={(date) =>
                  setStartDate(moment(date).format("YYYY-MM-DD"))
                }
                className="form-control"
              />
            </Form.Group>
          </Col>
          <Col md={6} xs={12}>
            <Form.Group>
              <Form.Label>End Date:</Form.Label>
              <DatePicker
                name="end_date"
                value={endDate ? moment(endDate) : moment(new Date())}
                format="DD-MM-YYYY"
                maxDate={moment(new Date())}
                onChange={(date) =>
                  setEndDate(moment(date).format("YYYY-MM-DD"))
                }
                className="form-control"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3 align-items-end">
          <Col md={5} xs={12} className="mb-2 mb-md-0">
            <Form.Group className="form-group mb-0">
              <Form.Label>Payment Method</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                <Form.Check
                  type="radio"
                  inline
                  name="paid_by"
                  value="Cash"
                  id="inlineRadio1"
                  className="me-2"
                  label="Cash"
                  checked={paymentMethod === "CASH"}
                  onChange={() => setPaymentMethod("CASH")}
                />
                <Form.Check
                  type="radio"
                  inline
                  name="paid_by"
                  value="Cheque"
                  id="inlineRadio2"
                  className="me-2"
                  label="Cheque"
                  checked={paymentMethod === "CHEQUE"}
                  onChange={() => setPaymentMethod("CHEQUE")}
                />
                <Form.Check
                  type="radio"
                  inline
                  name="paid_by"
                  value="Online"
                  id="inlineRadio3"
                  className="me-0"
                  label="Online"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4} xs={8} className="mb-2 mb-md-0">
            <Form.Group className="form-group mb-0">
              <Form.Label>Select Patient</Form.Label>
              <Select
                id="patient"
                isClearable={true}
                name="patient_id"
                options={patients}
                value={
                  patientId
                    ? patients.find((patient) => patientId === patient.value)
                    : null
                }
                onChange={(option) =>
                  setPatientId(option ? option.value : null)
                }
              />
            </Form.Group>
          </Col>
          <Col md={3} xs={4} className="d-flex align-items-center gap-2">
            <Button
              variant="outline-primary"
              onClick={handleFilter}
              disabled={loading}
              className="filterBtn flex-grow-1 d-flex align-items-center justify-content-center"
              title="Apply Filter"
            >
              <span className="material-symbols-outlined me-1">filter_alt</span> Filter
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleClear}
              disabled={loading}
              className="filterBtn flex-grow-1"
            >
              Clear
            </Button>
          </Col>
        </Row>
        {reports.length > 0 ? (
          <>
            <Table bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Payment Date</th>
                  <th>Type</th>
                  <th>Amount </th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report, index) => (
                  <tr key={index}>
                    <td>{report.patient?.name}</td>
                    <td>{moment(report.payment_date).format("DD-MM-YYYY")}</td>
                    <td>{report.paid_by}</td>
                    <td>₹{report.amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[
                  ...Array(Math.ceil(reports.length / itemsPerPage)).keys(),
                ].map((number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => paginate(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(reports.length / itemsPerPage)
                  }
                />
              </Pagination>
            </div>
          </>
        ) : loading ? (
          <Loader />
        ) : (
          <p>No Data Found</p>
        )}
      </div>
    </Can>
  );
};
export default Reports;
