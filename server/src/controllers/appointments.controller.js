const prisma = require("../config/prisma");
const moment = require("moment");

const formatAppointment = (a) => {
  if (!a) return null;
  const pkg = a.patient?.package || null;
  return {
    id: a.id,
    patient_id: a.patient_id,
    patient: a.patient
      ? {
          id: a.patient.id,
          name: a.patient.name,
          mobile: a.patient.mobile,
          date_of_birth: a.patient.date_of_birth || "",
          gender: a.patient.gender || "",
          package: pkg
            ? {
                id: pkg.id,
                name: pkg.name,
                seating_count: pkg.seating_count,
                available_count: pkg.available_count ?? pkg.seating_count,
                amount: pkg.amount,
              }
            : null,
          contact: {
            name: a.patient.name,
            mobile: a.patient.mobile,
          },
        }
      : null,
    package: pkg
      ? {
          id: pkg.id,
          name: pkg.name,
          seating_count: pkg.seating_count,
          available_count: pkg.available_count ?? pkg.seating_count,
          amount: pkg.amount,
        }
      : null,
    doctor_id: a.doctor_id,
    doctor: a.doctor
      ? {
          id: a.doctor.id,
          name: `Dr. ${a.doctor.first_name} ${a.doctor.last_name}`,
          contact: {
            first_name: a.doctor.first_name,
            last_name: a.doctor.last_name,
            name: `Dr. ${a.doctor.first_name} ${a.doctor.last_name}`,
          },
        }
      : null,
    date: a.date,
    time: a.time,
    status: a.status || "UPCOMING",
    details: a.details || "",
    diagnosis: a.diagnosis || "",
    medical_history: a.medical_history || "",
    doctor_note: a.doctor_note || "",
    fee: a.fee !== null && a.fee !== undefined ? a.fee : 0,
    treatment_plan: a.treatment_plan || "",
    observation_details: a.observation_details || "",
    investigation_details: a.investigation_details || "",
    family_medical_history: a.family_medical_history || "",
    current_condition: a.current_condition || "",
    procedures: a.procedures || "",
    bp_detail: a.bp_detail || "",
    weight: a.weight || "",
    height: a.height || "",
    seating_no: a.seating_no || "",
    created_at: a.created_at,
    updated_at: a.updated_at,
  };
};

const getAppointments = async (req, res) => {
  try {
    const { start_date, end_date, days, status, patient_id, assets } = req.query;
    const clinicId = req.clinicId;

    const where = {};
    if (clinicId) where.clinic_id = clinicId;
    if (patient_id) where.patient_id = parseInt(patient_id);

    // Doctor role-scoped filtering (Bug #3)
    if (req.user && req.user.role === "DOCTOR") {
      const doctorProfile = await prisma.doctor.findFirst({
        where: { user_id: req.user.id },
      });
      if (doctorProfile) {
        where.doctor_id = doctorProfile.id;
      }
    }

    // Status filtering - only apply if not "ALL" and valid (Bug #6 & #12)
    if (status && status !== "ALL" && status !== "undefined" && status !== "null") {
      where.status = status;
    }

    if (days) {
      const dayCount = parseInt(days);
      const today = moment().format("YYYY-MM-DD");
      const targetDate = moment().add(dayCount, "days").format("YYYY-MM-DD");
      where.date = {
        gte: today,
        lte: targetDate,
      };
    } else if (start_date && end_date) {
      where.date = {
        gte: String(start_date),
        lte: String(end_date),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            package: true,
          },
        },
        doctor: true,
      },
      orderBy: { date: "desc" },
    });

    return res.status(200).json(appointments.map(formatAppointment));
  } catch (error) {
    console.error("getAppointments error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch appointments" });
  }
};

const getAppointmentDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            package: true,
          },
        },
        doctor: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: true, message: "Appointment not found" });
    }

    return res.status(200).json(formatAppointment(appointment));
  } catch (error) {
    console.error("getAppointmentDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch appointment details" });
  }
};

const addAppointment = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const {
      patient_id,
      doctor_id,
      date,
      time,
      details,
      status,
      diagnosis,
      medical_history,
      doctor_note,
      fee,
      treatment_plan,
      observation_details,
      investigation_details,
      family_medical_history,
      current_condition,
      procedures,
      bp_detail,
      weight,
      height,
      seating_no,
    } = req.body;

    const newAppointment = await prisma.appointment.create({
      data: {
        clinic_id: clinicId,
        patient_id: parseInt(patient_id),
        doctor_id: doctor_id ? parseInt(doctor_id) : null,
        date: String(date || moment().format("YYYY-MM-DD")),
        time: String(time || "10:00 AM"),
        details: details || "",
        status: status || "UPCOMING",
        diagnosis: diagnosis || "",
        medical_history: medical_history || "",
        doctor_note: doctor_note || "",
        fee: fee !== undefined && fee !== null && fee !== "" ? parseFloat(fee) : 0,
        treatment_plan: treatment_plan || "",
        observation_details: observation_details || "",
        investigation_details: investigation_details || "",
        family_medical_history: family_medical_history || "",
        current_condition: current_condition || "",
        procedures: procedures || "",
        bp_detail: bp_detail || "",
        weight: weight !== undefined ? String(weight) : "",
        height: height !== undefined ? String(height) : "",
        seating_no: seating_no !== undefined ? String(seating_no) : "",
      },
      include: {
        patient: {
          include: {
            package: true,
          },
        },
        doctor: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: formatAppointment(newAppointment),
    });
  } catch (error) {
    console.error("addAppointment error:", error);
    return res.status(500).json({ error: true, message: "Failed to create appointment" });
  }
};

const editAppointment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      patient_id,
      doctor_id,
      date,
      time,
      details,
      status,
      diagnosis,
      medical_history,
      doctor_note,
      fee,
      treatment_plan,
      observation_details,
      investigation_details,
      family_medical_history,
      current_condition,
      procedures,
      bp_detail,
      weight,
      height,
      seating_no,
    } = req.body;

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        patient_id: patient_id !== undefined ? parseInt(patient_id) : undefined,
        doctor_id: doctor_id !== undefined ? (doctor_id ? parseInt(doctor_id) : null) : undefined,
        date: date !== undefined ? String(date) : undefined,
        time: time !== undefined ? String(time) : undefined,
        details: details !== undefined ? details : undefined,
        status: status !== undefined ? status : undefined,
        diagnosis: diagnosis !== undefined ? diagnosis : undefined,
        medical_history: medical_history !== undefined ? medical_history : undefined,
        doctor_note: doctor_note !== undefined ? doctor_note : undefined,
        fee: fee !== undefined && fee !== null && fee !== "" ? parseFloat(fee) : undefined,
        treatment_plan: treatment_plan !== undefined ? treatment_plan : undefined,
        observation_details: observation_details !== undefined ? observation_details : undefined,
        investigation_details: investigation_details !== undefined ? investigation_details : undefined,
        family_medical_history: family_medical_history !== undefined ? family_medical_history : undefined,
        current_condition: current_condition !== undefined ? current_condition : undefined,
        procedures: procedures !== undefined ? procedures : undefined,
        bp_detail: bp_detail !== undefined ? bp_detail : undefined,
        weight: weight !== undefined ? String(weight) : undefined,
        height: height !== undefined ? String(height) : undefined,
        seating_no: seating_no !== undefined ? String(seating_no) : undefined,
      },
      include: {
        patient: {
          include: {
            package: true,
          },
        },
        doctor: true,
      },
    });

    const formatted = formatAppointment(updated);
    return res.status(200).json({
      ...formatted,
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("editAppointment error:", error);
    return res.status(500).json({ error: true, message: "Failed to update appointment" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.appointment.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("deleteAppointment error:", error);
    return res.status(500).json({ error: true, message: "Failed to delete appointment" });
  }
};

const uploadAppointmentDocs = async (req, res) => {
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
          entity_type: "appointment",
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
      message: "Appointment documents uploaded",
      data: createdAssets,
    });
  } catch (error) {
    console.error("uploadAppointmentDocs error:", error);
    return res.status(500).json({ error: true, message: "Failed to upload appointment docs" });
  }
};

module.exports = {
  getAppointments,
  getAppointmentDetails,
  addAppointment,
  editAppointment,
  deleteAppointment,
  uploadAppointmentDocs,
  formatAppointment,
};
