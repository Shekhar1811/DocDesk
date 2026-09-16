const prisma = require("../config/prisma");

const getMedicines = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const medicines = await prisma.medicine.findMany({
      where: clinicId ? { clinic_id: clinicId } : undefined,
      orderBy: { name: "asc" },
    });
    return res.status(200).json(medicines);
  } catch (error) {
    console.error("getMedicines error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch medicines" });
  }
};

const getMedicineDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) {
      return res.status(404).json({ error: true, message: "Medicine not found" });
    }
    return res.status(200).json(medicine);
  } catch (error) {
    console.error("getMedicineDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch medicine" });
  }
};

const addMedicine = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { name, type, dosage, description } = req.body;

    const newMed = await prisma.medicine.create({
      data: {
        clinic_id: clinicId,
        name,
        type: type || "Tablet",
        dosage: dosage || "",
        description: description || "",
      },
    });

    return res.status(200).json({ success: true, data: newMed });
  } catch (error) {
    console.error("addMedicine error:", error);
    return res.status(500).json({ error: true, message: "Failed to add medicine" });
  }
};

const editMedicine = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, dosage, description } = req.body;

    const updated = await prisma.medicine.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        type: type !== undefined ? type : undefined,
        dosage: dosage !== undefined ? dosage : undefined,
        description: description !== undefined ? description : undefined,
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("editMedicine error:", error);
    return res.status(500).json({ error: true, message: "Failed to update medicine" });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.medicine.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("deleteMedicine error:", error);
    return res.status(500).json({ error: true, message: "Failed to delete medicine" });
  }
};

const getMasterMedicines = async (req, res) => {
  try {
    const masterMeds = await prisma.masterMedicine.findMany({
      orderBy: { name: "asc" },
    });
    return res.status(200).json(masterMeds);
  } catch (error) {
    console.error("getMasterMedicines error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch master medicines" });
  }
};

// Prescriptions
const getPrescriptions = async (req, res) => {
  try {
    const { appointment_id } = req.query;
    const where = {};
    if (appointment_id) where.appointment_id = parseInt(appointment_id);

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        doctor: true,
        patient: true,
      },
    });

    return res.status(200).json(prescriptions);
  } catch (error) {
    console.error("getPrescriptions error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch prescriptions" });
  }
};

const addPrescriptions = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { appointment_id, patient_id, doctor_id, medicine_name, dosage, frequency, duration, instructions } = req.body;

    const prescription = await prisma.prescription.create({
      data: {
        clinic_id: clinicId,
        appointment_id: parseInt(appointment_id),
        patient_id: parseInt(patient_id),
        doctor_id: doctor_id ? parseInt(doctor_id) : null,
        medicine_name: medicine_name || "Paracetamol 500mg",
        dosage: dosage || "1 tablet",
        frequency: frequency || "Twice daily",
        duration: duration || "5 days",
        instructions: instructions || "After food",
      },
    });

    return res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    console.error("addPrescriptions error:", error);
    return res.status(500).json({ error: true, message: "Failed to create prescription" });
  }
};

const editPrescriptions = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { medicine_name, dosage, frequency, duration, instructions } = req.body;

    const updated = await prisma.prescription.update({
      where: { id },
      data: {
        medicine_name: medicine_name !== undefined ? medicine_name : undefined,
        dosage: dosage !== undefined ? dosage : undefined,
        frequency: frequency !== undefined ? frequency : undefined,
        duration: duration !== undefined ? duration : undefined,
        instructions: instructions !== undefined ? instructions : undefined,
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("editPrescriptions error:", error);
    return res.status(500).json({ error: true, message: "Failed to update prescription" });
  }
};

const deletePrescription = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.prescription.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Prescription deleted" });
  } catch (error) {
    console.error("deletePrescription error:", error);
    return res.status(500).json({ error: true, message: "Failed to delete prescription" });
  }
};

module.exports = {
  getMedicines,
  getMedicineDetails,
  addMedicine,
  editMedicine,
  deleteMedicine,
  getMasterMedicines,
  getPrescriptions,
  addPrescriptions,
  editPrescriptions,
  deletePrescription,
};
