const prisma = require("../config/prisma");

const formatDoctor = (d) => {
  if (!d) return null;
  return {
    id: d.id,
    contact: {
      first_name: d.first_name,
      last_name: d.last_name,
      email: d.email || "",
      mobile: d.mobile || "",
    },
    specialization: d.specialization || "General Physician",
    qualification: d.qualification || "MBBS",
    experience: d.experience || "5+ Years",
    photo_url: d.photo_url || "",
    address: {
      line1: d.address_line1 || "",
      city: d.city || "Mumbai",
      state: d.state || "Maharashtra",
      zipcode: d.zipcode || "400001",
    },
  };
};

const getDoctors = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const doctors = await prisma.doctor.findMany({
      where: clinicId ? { clinic_id: clinicId } : undefined,
      orderBy: { id: "asc" },
    });
    return res.status(200).json(doctors.map(formatDoctor));
  } catch (error) {
    console.error("getDoctors error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch doctors" });
  }
};

const getDoctorDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return res.status(404).json({ error: true, message: "Doctor not found" });
    }
    return res.status(200).json(formatDoctor(doctor));
  } catch (error) {
    console.error("getDoctorDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch doctor details" });
  }
};

const addDoctor = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { contact, specialization, qualification, experience, address } = req.body;

    const newDoctor = await prisma.doctor.create({
      data: {
        clinic_id: clinicId,
        first_name: contact?.first_name || "",
        last_name: contact?.last_name || "",
        email: contact?.email || "",
        mobile: contact?.mobile || "",
        specialization: specialization || "General Medicine",
        qualification: qualification || "MBBS",
        experience: experience || "",
        address_line1: address?.line1 || "",
        city: address?.city || "",
        state: address?.state || "",
        zipcode: address?.zipcode || "",
      },
    });

    return res.status(200).json({ success: true, data: formatDoctor(newDoctor) });
  } catch (error) {
    console.error("addDoctor error:", error);
    return res.status(500).json({ error: true, message: "Failed to add doctor" });
  }
};

const editDoctor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { contact, specialization, qualification, experience, address } = req.body;

    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        first_name: contact?.first_name !== undefined ? contact.first_name : undefined,
        last_name: contact?.last_name !== undefined ? contact.last_name : undefined,
        email: contact?.email !== undefined ? contact.email : undefined,
        mobile: contact?.mobile !== undefined ? contact.mobile : undefined,
        specialization: specialization !== undefined ? specialization : undefined,
        qualification: qualification !== undefined ? qualification : undefined,
        experience: experience !== undefined ? experience : undefined,
        address_line1: address?.line1 !== undefined ? address.line1 : undefined,
        city: address?.city !== undefined ? address.city : undefined,
        state: address?.state !== undefined ? address.state : undefined,
        zipcode: address?.zipcode !== undefined ? address.zipcode : undefined,
      },
    });

    return res.status(200).json({ success: true, data: formatDoctor(updated) });
  } catch (error) {
    console.error("editDoctor error:", error);
    return res.status(500).json({ error: true, message: "Failed to update doctor" });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.doctor.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("deleteDoctor error:", error);
    return res.status(500).json({ error: true, message: "Failed to delete doctor" });
  }
};

module.exports = {
  getDoctors,
  getDoctorDetails,
  addDoctor,
  editDoctor,
  deleteDoctor,
  formatDoctor,
};
