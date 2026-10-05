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
import { Can } from "./../../context/AuthProvider";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const alert = useAlert();

  useEffect(() => {
    setLoading(true);
    dataServices
      .getMedicines()
      .then((res) => {
        if (res.status === 200) {
          setMedicines(res.data);
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

  const indexOfLastMedicine = currentPage * itemsPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - itemsPerPage;
  const currentMedicines = medicines.slice(
    indexOfFirstMedicine,
    indexOfLastMedicine
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    dataServices.deleteMedicine(id).then((res) => {
      if (res.status === 200) {
        const updatedMeds = medicines.filter((note) => note.id !== id);
        setMedicines(updatedMeds);
        alert.success("Medicine deleted successfully");
      } else {
        alert.error("Failed to delete medicine");
      }
    });
  };

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-2 pb-1 fw-bold text-black">Medicines</h6>
        <Can I="add" a="Medicine">
          <Link to="/add-medicines" className="btn btn-primary">
            Add Medicines
          </Link>
        </Can>
      </div>
      <Can I="list" a="Medicine">
        {currentMedicines.length > 0 ? (
          <>
            <Table bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th width={"100px"}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>{medicine.name}</td>
                    <td>{medicine.type}</td>
                    <td>
                      <Can I="read" a="Medicine">
                        <Link
                          className="me-3"
                          to={"/medicines-details/" + medicine.id}
                        >
                          View
                        </Link>
                      </Can>
                      <Can I="delete" a="Medicine">
                        <Link
                          to="#"
                          className="me-3 text-danger"
                          onClick={() =>
                            showAlert("Medicine", handleDelete, medicine.id)
                          }
                        >
                          Delete
                        </Link>
                      </Can>
                    </td>
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
                  ...Array(Math.ceil(medicines.length / itemsPerPage)).keys(),
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
                    currentPage === Math.ceil(medicines.length / itemsPerPage)
                  }
                />
              </Pagination>
            </div>
          </>
        ) : (
          loading && <Loader />
        )}
      </Can>
    </div>
  );
};

export default Medicines;
