const prisma = require("../config/prisma");

const formatPatient = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    contact: {
      name: p.name,
      mobile: p.mobile,
      email: p.email || "",
    },
    gender: p.gender,
    date_of_birth: p.date_of_birth,
    registration_date: p.registration_date,
    description: p.description || "",
    status: p.status || "Active",
    is_expiring_soon: p.is_expiring_soon || false,
    package_start_date: p.package_start_date,
    package_end_date: p.package_end_date,
    package_id: p.package_id,
    package: p.package
      ? {
          id: p.package.id,
          name: p.package.name,
          amount: p.package.amount,
          seating_count: p.package.seating_count,
          available_count: p.package.available_count ?? p.package.seating_count,
        }
      : null,
    address: {
      line1: p.address_line1 || "",
      line2: p.address_line2 || "",
      city: p.city || "",
      state: p.state || "",
      zipcode: p.zipcode || "",
    },
  };
};

const getPatients = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const patients = await prisma.patient.findMany({
      where: clinicId ? { clinic_id: clinicId } : undefined,
      include: { package: true },
      orderBy: { id: "asc" },
    });

    return res.status(200).json(patients.map(formatPatient));
  } catch (error) {
    console.error("getPatients error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch patients" });
  }
};

const getPatientsSlim = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const patients = await prisma.patient.findMany({
      where: clinicId ? { clinic_id: clinicId } : undefined,
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return res.status(200).json(patients);
  } catch (error) {
    console.error("getPatientsSlim error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch slim patients" });
  }
};

const getPatientDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { package: true },
    });

    if (!patient) {
      return res.status(404).json({ error: true, message: "Patient not found" });
    }

    return res.status(200).json(formatPatient(patient));
  } catch (error) {
    console.error("getPatientDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch patient details" });
  }
};

const addPatient = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { contact, date_of_birth, registration_date, gender, address, package_id, package_start_date, package_end_date, description, status } = req.body;

    if (!contact?.name || !contact?.mobile) {
      return res.status(422).json({
        error: true,
        messages: {
          name: !contact?.name ? ["Name is required"] : [],
          mobile: !contact?.mobile ? ["Phone number is required"] : [],
        },
      });
    }

    const newPatient = await prisma.patient.create({
      data: {
        clinic_id: clinicId,
        name: contact.name,
        mobile: contact.mobile,
        email: contact.email || "",
        date_of_birth: date_of_birth ? String(date_of_birth) : null,
        registration_date: registration_date ? String(registration_date) : null,
        gender: gender || "MALE",
        address_line1: address?.line1 || "",
        address_line2: address?.line2 || "",
        city: address?.city || "",
        state: address?.state || "",
        zipcode: address?.zipcode || "",
        package_id: package_id ? parseInt(package_id) : null,
        package_start_date: package_start_date ? String(package_start_date) : null,
        package_end_date: package_end_date ? String(package_end_date) : null,
        description: description || "",
        status: status || "Active",
      },
      include: { package: true },
    });

    return res.status(201).json({
      success: true,
      message: "Patient added successfully",
      data: formatPatient(newPatient),
    });
  } catch (error) {
    console.error("addPatient error:", error);
    return res.status(500).json({ error: true, message: "Failed to create patient" });
  }
};

const editPatient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { contact, date_of_birth, registration_date, gender, address, package_id, package_start_date, package_end_date, description, status } = req.body;

    const updated = await prisma.patient.update({
      where: { id },
      data: {
        name: contact?.name !== undefined ? contact.name : undefined,
        mobile: contact?.mobile !== undefined ? contact.mobile : undefined,
        email: contact?.email !== undefined ? contact.email : undefined,
        date_of_birth: date_of_birth !== undefined ? String(date_of_birth) : undefined,
        registration_date: registration_date !== undefined ? String(registration_date) : undefined,
        gender: gender !== undefined ? gender : undefined,
        address_line1: address?.line1 !== undefined ? address.line1 : undefined,
        address_line2: address?.line2 !== undefined ? address.line2 : undefined,
        city: address?.city !== undefined ? address.city : undefined,
        state: address?.state !== undefined ? address.state : undefined,
        zipcode: address?.zipcode !== undefined ? address.zipcode : undefined,
        package_id: package_id !== undefined ? (package_id ? parseInt(package_id) : null) : undefined,
        package_start_date: package_start_date !== undefined ? String(package_start_date) : undefined,
        package_end_date: package_end_date !== undefined ? String(package_end_date) : undefined,
        description: description !== undefined ? description : undefined,
        status: status !== undefined ? status : undefined,
      },
      include: { package: true },
    });

    return res.status(200).json({
      success: true,
      data: formatPatient(updated),
    });
  } catch (error) {
    console.error("editPatient error:", error);
    return res.status(500).json({ error: true, message: "Failed to update patient" });
  }
};

const deletePatient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.patient.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    console.error("deletePatient error:", error);
    return res.status(500).json({ error: true, message: "Failed to delete patient" });
  }
};

const uploadPatientDocs = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const files = req.files || (req.file ? [req.file] : []);

    const createdAssets = [];
    for (const file of files) {
      const fileUrl = (file.path && file.path.startsWith("http"))
        ? file.path
        : `/uploads/${file.filename}`;
      const asset = await prisma.asset.create({
        data: {
          clinic_id: req.clinicId || 1,
          entity_type: "patient",
          entity_id: id,
          file_name: file.originalname || "document",
          file_url: fileUrl,
          file_type: file.mimetype || "application/octet-stream",
        },
      });
      createdAssets.push(asset);
    }

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: createdAssets,
    });
  } catch (error) {
    console.error("uploadPatientDocs error:", error);
    return res.status(500).json({ error: true, message: "Failed to upload patient documents" });
  }
};

module.exports = {
  getPatients,
  getPatientsSlim,
  getPatientDetails,
  addPatient,
  editPatient,
  deletePatient,
  uploadPatientDocs,
  formatPatient,
};
