const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { JWT_SECRET } = require("../middleware/auth");

const ALL_PERMISSIONS = [
  "listHome", "readHome",
  "listPatient", "readPatient", "addPatient", "editPatient", "deletePatient",
  "listAppointment", "readAppointment", "addAppointment", "editAppointment", "deleteAppointment",
  "listDoctor", "readDoctor", "addDoctor", "editDoctor", "deleteDoctor",
  "listEmployee", "readEmployee", "addEmployee", "editEmployee", "deleteEmployee",
  "listInvoice", "readInvoice", "addInvoice", "editInvoice", "deleteInvoice",
  "listPackage", "readPackage", "addPackage", "editPackage", "deletePackage",
  "listMedicine", "readMedicine", "addMedicine", "editMedicine", "deleteMedicine",
  "listNote", "readNote", "addNote", "editNote", "deleteNote",
  "listClinicProfile", "readClinicProfile", "editClinicProfile", "readClinic", "editClinic",
  "listProfile", "readProfile", "editProfile",
  "listReport", "readReport"
];

const DOCTOR_PERMISSIONS = [
  "listHome", "readHome",
  "listPatient", "readPatient",
  "listAppointment", "readAppointment", "editAppointment",
  "listDoctor", "readDoctor",
  "listMedicine", "readMedicine",
  "listNote", "readNote", "addNote", "editNote",
  "listProfile", "readProfile", "editProfile"
];

const EMPLOYEE_PERMISSIONS = [
  "listHome", "readHome",
  "listPatient", "readPatient", "addPatient", "editPatient",
  "listAppointment", "readAppointment", "addAppointment", "editAppointment",
  "listDoctor", "readDoctor",
  "listInvoice", "readInvoice", "addInvoice",
  "listPackage", "readPackage",
  "listMedicine", "readMedicine",
  "listNote", "readNote", "addNote",
  "listProfile", "readProfile", "editProfile"
];

const getDefaultPermissions = (role) => {
  if (role === "DOCTOR") return DOCTOR_PERMISSIONS;
  if (role === "EMPLOYEE" || role === "STAFF") return EMPLOYEE_PERMISSIONS;
  return ALL_PERMISSIONS;
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        error: true,
        messages: {
          email: !email ? ["The email field is required."] : [],
          password: !password ? ["The password field is required."] : [],
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { clinic: true },
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        clinic_id: user.clinic_id,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      access_token: token,
      data: {
        username: user.email,
        token: token,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        is_admin: user.role === "ADMIN" ? "1" : "0",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error during login",
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, name, email, password, clinic_name, phone } = req.body;

    const userEmail = (email || username || "").toLowerCase().trim();
    if (!userEmail || !password) {
      return res.status(422).json({
        error: true,
        messages: {
          email: !userEmail ? ["Email is required."] : [],
          password: !password ? ["Password is required."] : [],
        },
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "A user with this email address already exists.",
      });
    }

    const clinic = await prisma.clinic.create({
      data: {
        name: clinic_name || "Sunrise Multi-Specialty Clinic",
        phone: phone || "9876543210",
        email: userEmail,
        address_line1: "Main Boulevard, Suite 101",
        city: "Mumbai",
        state: "Maharashtra",
        zipcode: "400001",
      },
    });

    const fullName = (name || username || "Admin User").trim();
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || "Admin";
    const lastName = nameParts.slice(1).join(" ") || "User";

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        clinic_id: clinic.id,
        email: userEmail,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role: "ADMIN",
        permissions: JSON.stringify(ALL_PERMISSIONS),
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        clinic_id: user.clinic_id,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      access_token: token,
      data: {
        username: user.email,
        token: token,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        is_admin: "1",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error during registration",
    });
  }
};

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const getUser = async (req, res) => {
  try {
    const user = req.user;
    let permissions = [];
    if (user.permissions) {
      try {
        permissions = JSON.parse(user.permissions);
      } catch (e) {
        permissions = getDefaultPermissions(user.role);
      }
    } else {
      permissions = getDefaultPermissions(user.role);
    }

    return res.status(200).json({
      contact: {
        email: user.email,
        mobile: user.mobile || "",
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        permissions: permissions,
      },
      clinic: {
        id: user.clinic.id,
        name: user.clinic.name,
      },
      date_of_birth: user.date_of_birth || "",
      gender: user.gender || "MALE",
      address: {
        line1: user.address_line1 || "",
        city: user.city || "",
        zipcode: user.zipcode || "",
      },
    });
  } catch (error) {
    console.error("getUser error:", error);
    return res.status(500).json({
      error: true,
      message: "Error fetching user data",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, mobile, date_of_birth, gender, address } = req.body;

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        first_name: first_name !== undefined ? first_name : undefined,
        last_name: last_name !== undefined ? last_name : undefined,
        mobile: mobile !== undefined ? mobile : undefined,
        date_of_birth: date_of_birth !== undefined ? date_of_birth : undefined,
        gender: gender !== undefined ? gender : undefined,
        address_line1: address?.line1 !== undefined ? address.line1 : undefined,
        city: address?.city !== undefined ? address.city : undefined,
        zipcode: address?.zipcode !== undefined ? address.zipcode : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("updateUser error:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  login,
  register,
  logout,
  getUser,
  updateUser,
  ALL_PERMISSIONS,
  DOCTOR_PERMISSIONS,
  getDefaultPermissions,
};
