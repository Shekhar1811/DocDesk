import React, { useEffect, useState } from "react";
import dataServices from "../../apiServices/data.services";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import Loader from "../../components/Loader/Loader";
import { Can } from "./../../context/AuthProvider";
import {
  getInitials,
  handleValidationError,
  showAlert,
} from "./../../components/CommonFunctions";

const Employee = () => {
  const [employees, setEmployees] = useState();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  useEffect(() => {
    setLoading(true);
    dataServices
      .getEmployees()
      .then((res) => {
        if (res.status === 200) {
          setEmployees(res.data);
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
    // Add your delete logic here
    dataServices.deleteEmployee(id).then((res) => {
      if (res.status === 200) {
        const updatedDoctors = employees.filter(
          (employee) => employee.id !== id
        );
        setEmployees(updatedDoctors);
        alert.success("Employee deleted successfully");
      } else {
        alert.error("Failed to delete employee");
      }
    });
  };
  return (
    <div className="content-wrapper">
      <div className="py-3">
        {/* Specialist */}
        <Can I="list" this="Employee">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-2 pb-1   fw-bold text-black">Employees</h6>
              </div>
              <div>
                <Can I="add" an="Employee">
                  <Link
                    to="/add-employee"
                    className="btn btn-primary"
                  >
                    Add Employee
                  </Link>
                </Can>
              </div>
            </div>
            <div className="list">
              {employees
                ? employees.map((employee, i) => {
                    const { contact } = employee;
                    return (
                      <Can I="read" an="Employee" passThrough key={i}>
                        {(allowed) => (
                          <div className="list-item" >
                            <Link
                              to={`/employee-profile/${employee.id}`}
                              className="d-flex"
                              key={employee.id}
                              disabled={!allowed}
                            >
                              <div className="list-item-avtar">
                                <div className="profileImage">
                                  {getInitials(
                                    contact?.first_name +
                                      " " +
                                      contact?.last_name
                                  )}
                                </div>
                              </div>
                              <div className="small">
                                <h6 className="mb-1 fs-14">
                                  {contact.first_name + " " + contact.last_name}
                                </h6>
                                <small className="text-muted">
                                  {employee.contact?.mobile}
                                </small>
                                <br />
                                <small className="text-muted">
                                  {employee.designation}
                                </small>
                              </div>
                            </Link>
                            <Can I="delete" an="Employee">
                              <Link
                                to="#"
                                className="delete-icon"
                                onClick={() =>
                                  showAlert(
                                    "Employee",
                                    handleDelete,
                                    employee.id
                                  )
                                }
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </Link>
                            </Can>
                          </div>
                        )}
                      </Can>
                    );
                  })
                : loading && <Loader />}
            </div>
          </div>
        </Can>
      </div>
    </div>
  );
};

export default Employee;
