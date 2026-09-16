const prisma = require("../config/prisma");

const formatClinic = (clinic) => {
  if (!clinic) return null;
  return {
    id: clinic.id,
    name: clinic.name,
    number: clinic.number || "REG-2026-001",
    registration_date: clinic.registration_date || "2024-01-01",
    gst_number: clinic.gst_number || "27AABCS1429B1Z8",
    phone: clinic.phone || "",
    email: clinic.email || "",
    address: {
      line1: clinic.address_line1 || "",
      line2: clinic.address_line2 || "",
      city: clinic.city || "Mumbai",
      state: clinic.state || "Maharashtra",
      zipcode: clinic.zipcode || "400001",
    },
    logo: {
      url: clinic.logo_url || "/uploads/clinic-logo.png",
    },
    favicon: {
      url: clinic.favicon_url || "/uploads/clinic-favicon.png",
    },
    scanner: {
      url: clinic.scanner_url || "/uploads/clinic-scanner.png",
    },
  };
};

const getClinic = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const clinic = await prisma.clinic.findUnique({
      where: { id },
    });

    if (!clinic) {
      return res.status(404).json({
        error: true,
        message: "Clinic not found",
      });
    }

    return res.status(200).json(formatClinic(clinic));
  } catch (error) {
    console.error("getClinic error:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch clinic details",
    });
  }
};

const editClinic = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, number, registration_date, gst_number, phone, email, address } = req.body;

    const updated = await prisma.clinic.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        number: number !== undefined ? number : undefined,
        registration_date: registration_date !== undefined ? registration_date : undefined,
        gst_number: gst_number !== undefined ? gst_number : undefined,
        phone: phone !== undefined ? phone : undefined,
        email: email !== undefined ? email : undefined,
        address_line1: address?.line1 !== undefined ? address.line1 : undefined,
        address_line2: address?.line2 !== undefined ? address.line2 : undefined,
        city: address?.city !== undefined ? address.city : undefined,
        state: address?.state !== undefined ? address.state : undefined,
        zipcode: address?.zipcode !== undefined ? address.zipcode : undefined,
      },
    });

    return res.status(200).json(formatClinic(updated));
  } catch (error) {
    console.error("editClinic error:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to update clinic",
    });
  }
};

const uploadClinicAsset = (type) => async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }

    const fileUrl = file.path || `/uploads/${file.filename}`;

    const updateData = {};
    if (type === "logo") updateData.logo_url = fileUrl;
    else if (type === "favicon") updateData.favicon_url = fileUrl;
    else if (type === "scanner") updateData.scanner_url = fileUrl;

    const updated = await prisma.clinic.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      data: formatClinic(updated),
    });
  } catch (error) {
    console.error(`uploadClinic ${type} error:`, error);
    return res.status(500).json({
      error: true,
      message: "Failed to upload clinic asset",
    });
  }
};

module.exports = {
  getClinic,
  editClinic,
  uploadClinicAsset,
  formatClinic,
};
