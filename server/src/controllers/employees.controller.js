const prisma = require("../config/prisma");

const formatEmployee = (e) => {
  if (!e) return null;
  return {
    id: e.id,
    contact: {
      first_name: e.first_name,
      last_name: e.last_name,
      email: e.email || "",
      mobile: e.mobile || "",
    },
    gender: e.gender || "",
    date_of_birth: e.date_of_birth || "",
    date_of_join: e.date_of_joining || "",
    date_of_joining: e.date_of_joining || "",
    designation: e.designation || "Staff",
    department: e.department || "Operations",
    address: {
      line1: e.address_line1 || "",
      city: e.city || "Mumbai",
      state: e.state || "Maharashtra",
      zipcode: e.zipcode || "400001",
    },
  };
};

const getEmployees = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const employees = await prisma.employee.findMany({
      where: clinicId ? { clinic_id: clinicId } : undefined,
      orderBy: { id: "asc" },
    });
    return res.status(200).json(employees.map(formatEmployee));
  } catch (error) {
    console.error("getEmployees error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch employees" });
  }
};

const getEmployeeDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      return res.status(404).json({ error: true, message: "Employee not found" });
    }
    return res.status(200).json(formatEmployee(employee));
  } catch (error) {
    console.error("getEmployeeDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch employee details" });
  }
};

const addEmployee = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { contact, designation, department, date_of_joining, date_of_join, gender, date_of_birth, address } = req.body;
    const joiningDate = date_of_joining || date_of_join || "";

    const newEmp = await prisma.employee.create({
      data: {
        clinic_id: clinicId,
        first_name: contact?.first_name || "",
        last_name: contact?.last_name || "",
        email: contact?.email || "",
        mobile: contact?.mobile || "",
        gender: gender || req.body.gender || "",
        date_of_birth: date_of_birth ? String(date_of_birth) : (req.body.date_of_birth ? String(req.body.date_of_birth) : null),
        designation: designation || "Clinic Staff",
        department: department || "Operations",
        date_of_joining: joiningDate ? String(joiningDate) : null,
        address_line1: address?.line1 || "",
        city: address?.city || "",
        state: address?.state || "",
        zipcode: address?.zipcode || "",
      },
    });

    return res.status(200).json({ success: true, data: formatEmployee(newEmp) });
  } catch (error) {
    console.error("addEmployee error:", error);
    return res.status(500).json({ error: true, message: "Failed to add employee" });
  }
};

const editEmployee = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { contact, designation, department, date_of_joining, date_of_join, gender, date_of_birth, address } = req.body;
    const rawJoining = date_of_joining !== undefined ? date_of_joining : date_of_join;

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        first_name: contact?.first_name !== undefined ? contact.first_name : undefined,
        last_name: contact?.last_name !== undefined ? contact.last_name : undefined,
        email: contact?.email !== undefined ? contact.email : undefined,
        mobile: contact?.mobile !== undefined ? contact.mobile : undefined,
        gender: gender !== undefined ? gender : (req.body.gender !== undefined ? req.body.gender : undefined),
        date_of_birth: date_of_birth !== undefined ? (date_of_birth ? String(date_of_birth) : null) : (req.body.date_of_birth !== undefined ? (req.body.date_of_birth ? String(req.body.date_of_birth) : null) : undefined),
        designation: designation !== undefined ? designation : undefined,
        department: department !== undefined ? department : undefined,
        date_of_joining: rawJoining !== undefined ? (rawJoining ? String(rawJoining) : null) : undefined,
        address_line1: address?.line1 !== undefined ? address.line1 : undefined,
        city: address?.city !== undefined ? address.city : undefined,
        state: address?.state !== undefined ? address.state : undefined,
        zipcode: address?.zipcode !== undefined ? address.zipcode : undefined,
      },
    });

    return res.status(200).json({ success: true, data: formatEmployee(updated) });
  } catch (error) {
    console.error("editEmployee error:", error);
    return res.status(500).json({ error: true, message: "Failed to update employee" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.employee.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("deleteEmployee error:", error);
    return res.status(500).json({ error: true, message: "Failed to delete employee" });
  }
};

module.exports = {
  getEmployees,
  getEmployeeDetails,
  addEmployee,
  editEmployee,
  deleteEmployee,
  formatEmployee,
};
