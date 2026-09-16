const prisma = require("../config/prisma");
const moment = require("moment");

const formatInvoice = (inv) => {
  if (!inv) return null;
  return {
    id: inv.id,
    patient_id: inv.patient_id,
    patient: inv.patient
      ? {
          id: inv.patient.id,
          name: inv.patient.name,
          mobile: inv.patient.mobile,
          address: {
            line1: inv.patient.address_line1 || "",
            line2: inv.patient.address_line2 || "",
            city: inv.patient.city || "",
            state: inv.patient.state || "",
            zipcode: inv.patient.zipcode || "",
          },
        }
      : null,
    amount: inv.amount,
    paid_by: inv.paid_by,
    transaction_number: inv.transaction_number || `TXN${inv.id}82910`,
    payment_date: inv.payment_date,
    description: inv.description || "Medical Services & Consultation",
    status: inv.status || "PAID",
    invoice_items: inv.invoice_items || [],
  };
};

const getInvoices = async (req, res) => {
  try {
    const { patient_id } = req.query;
    const clinicId = req.clinicId;

    const where = {};
    if (clinicId) where.clinic_id = clinicId;
    if (patient_id) where.patient_id = parseInt(patient_id);

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        patient: true,
        invoice_items: true,
      },
      orderBy: { id: "desc" },
    });

    return res.status(200).json(invoices.map(formatInvoice));
  } catch (error) {
    console.error("getInvoices error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch invoices" });
  }
};

const getInvoiceDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        patient: true,
        invoice_items: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: true, message: "Invoice not found" });
    }

    return res.status(200).json(formatInvoice(invoice));
  } catch (error) {
    console.error("getInvoiceDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch invoice details" });
  }
};

const addInvoice = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { patient_id, amount, paid_by, payment_date, transaction_number, description, invoice_items } = req.body;

    const newInvoice = await prisma.invoice.create({
      data: {
        clinic_id: clinicId,
        patient_id: parseInt(patient_id),
        amount: parseFloat(amount),
        paid_by: paid_by || "ONLINE",
        payment_date: String(payment_date || moment().format("YYYY-MM-DD")),
        transaction_number: transaction_number || `TXN${Date.now()}`,
        description: description || "Consultation and medical care",
        status: "PAID",
        invoice_items: invoice_items && invoice_items.length > 0
          ? {
              create: invoice_items.map((item) => ({
                description: item.description,
                quantity: parseInt(item.quantity || 1),
                unit_price: parseFloat(item.unit_price || item.total_price || 0),
                total_price: parseFloat(item.total_price || 0),
              })),
            }
          : undefined,
      },
      include: {
        patient: true,
        invoice_items: true,
      },
    });

    return res.status(200).json({ success: true, data: formatInvoice(newInvoice) });
  } catch (error) {
    console.error("addInvoice error:", error);
    return res.status(500).json({ error: true, message: "Failed to create invoice" });
  }
};

const editInvoice = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { amount, paid_by, payment_date, transaction_number, description } = req.body;

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        paid_by: paid_by !== undefined ? paid_by : undefined,
        payment_date: payment_date !== undefined ? String(payment_date) : undefined,
        transaction_number: transaction_number !== undefined ? transaction_number : undefined,
        description: description !== undefined ? description : undefined,
      },
      include: {
        patient: true,
        invoice_items: true,
      },
    });

    return res.status(200).json({ success: true, data: formatInvoice(updated) });
  } catch (error) {
    console.error("editInvoice error:", error);
    return res.status(500).json({ error: true, message: "Failed to update invoice" });
  }
};

const getReports = async (req, res) => {
  try {
    const { start_date, end_date, paid_by, patient_id } = req.query;
    const clinicId = req.clinicId;

    const where = {};
    if (clinicId) where.clinic_id = clinicId;
    if (patient_id) where.patient_id = parseInt(patient_id);
    if (paid_by) where.paid_by = paid_by;

    if (start_date && end_date) {
      where.payment_date = {
        gte: String(start_date),
        lte: String(end_date),
      };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        patient: true,
      },
      orderBy: { payment_date: "desc" },
    });

    return res.status(200).json(invoices.map(formatInvoice));
  } catch (error) {
    console.error("getReports error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch reports" });
  }
};

const getStats = async (req, res) => {
  try {
    const { days } = req.query;
    const clinicId = req.clinicId;

    const where = {};
    if (clinicId) where.clinic_id = clinicId;

    if (days) {
      const dayCount = parseInt(days);
      const startDate = moment().subtract(dayCount, "days").format("YYYY-MM-DD");
      where.payment_date = {
        gte: startDate,
      };
    }

    const invoices = await prisma.invoice.findMany({ where });

    const total_amount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const total_online_invoices = invoices.filter((i) => i.paid_by === "ONLINE").length;
    const total_cash_invoices = invoices.filter((i) => i.paid_by === "CASH").length;
    const total_check_invoices = invoices.filter((i) => i.paid_by === "CHEQUE").length;
    const total_invoices = invoices.length;

    const total_patients = await prisma.patient.count({
      where: clinicId ? { clinic_id: clinicId } : undefined,
    });

    const total_appointments = await prisma.appointment.count({
      where: clinicId ? { clinic_id: clinicId } : undefined,
    });

    return res.status(200).json({
      total_amount,
      total_online_invoices,
      total_cash_invoices,
      total_check_invoices,
      total_invoices,
      total_patients,
      total_appointments,
    });
  } catch (error) {
    console.error("getStats error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch dashboard stats" });
  }
};

const getPrintInvoiceDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        patient: true,
        clinic: true,
        invoice_items: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: true, message: "Invoice not found" });
    }

    return res.status(200).json({
      id: invoice.id,
      amount: invoice.amount,
      payment_date: invoice.payment_date,
      description: invoice.description || "Medical Examination & Care",
      paid_by: invoice.paid_by,
      clinic: {
        name: invoice.clinic?.name || "DocDesk Health Center",
        phone: invoice.clinic?.phone || "+91 9876543210",
        logo_url: invoice.clinic?.logo_url || "/uploads/clinic-logo.png",
        scanner_url: invoice.clinic?.scanner_url || "/uploads/clinic-scanner.png",
        address: {
          line1: invoice.clinic?.address_line1 || "",
          line2: invoice.clinic?.address_line2 || "",
          city: invoice.clinic?.city || "Mumbai",
          state: invoice.clinic?.state || "Maharashtra",
          zipcode: invoice.clinic?.zipcode || "400001",
        },
      },
      patient: {
        name: invoice.patient?.name || "Patient",
        address: {
          line1: invoice.patient?.address_line1 || "",
          line2: invoice.patient?.address_line2 || "",
          city: invoice.patient?.city || "Mumbai",
          state: invoice.patient?.state || "Maharashtra",
          zipcode: invoice.patient?.zipcode || "400001",
        },
      },
      invoice_items: invoice.invoice_items,
    });
  } catch (error) {
    console.error("getPrintInvoiceDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch invoice for print" });
  }
};

module.exports = {
  getInvoices,
  getInvoiceDetails,
  addInvoice,
  editInvoice,
  getReports,
  getStats,
  getPrintInvoiceDetails,
  formatInvoice,
};
