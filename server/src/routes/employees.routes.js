const express = require("express");
const router = express.Router();
const employeesController = require("../controllers/employees.controller");
const { authMiddleware } = require("../middleware/auth");

router.get("/employees", authMiddleware, employeesController.getEmployees);
router.get("/employees/:id", authMiddleware, employeesController.getEmployeeDetails);
router.post("/employees", authMiddleware, employeesController.addEmployee);
router.patch("/employees/:id", authMiddleware, employeesController.editEmployee);
router.delete("/employees/:id", authMiddleware, employeesController.deleteEmployee);

module.exports = router;
