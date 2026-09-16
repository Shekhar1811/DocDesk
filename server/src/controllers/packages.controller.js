const prisma = require("../config/prisma");

const getPackages = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const packages = await prisma.package.findMany({
      where: clinicId ? { clinic_id: clinicId } : undefined,
      orderBy: { id: "asc" },
    });
    return res.status(200).json(packages);
  } catch (error) {
    console.error("getPackages error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch packages" });
  }
};

const getPackageDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      return res.status(404).json({ error: true, message: "Package not found" });
    }
    return res.status(200).json(pkg);
  } catch (error) {
    console.error("getPackageDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch package details" });
  }
};

const addPackage = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { name, amount, seating_count, available_count, description } = req.body;

    const newPkg = await prisma.package.create({
      data: {
        clinic_id: clinicId,
        name,
        amount: parseFloat(amount || 0),
        seating_count: parseInt(seating_count || 1),
        available_count: parseInt(available_count || seating_count || 1),
        description: description || "",
      },
    });

    return res.status(200).json({ success: true, data: newPkg });
  } catch (error) {
    console.error("addPackage error:", error);
    return res.status(500).json({ error: true, message: "Failed to create package" });
  }
};

const editPackage = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, amount, seating_count, available_count, description } = req.body;

    const updated = await prisma.package.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        seating_count: seating_count !== undefined ? parseInt(seating_count) : undefined,
        available_count: available_count !== undefined ? parseInt(available_count) : undefined,
        description: description !== undefined ? description : undefined,
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("editPackage error:", error);
    return res.status(500).json({ error: true, message: "Failed to update package" });
  }
};

const deletePackage = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.package.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    console.error("deletePackage error:", error);
    return res.status(500).json({ error: true, message: "Failed to delete package" });
  }
};

module.exports = {
  getPackages,
  getPackageDetails,
  addPackage,
  editPackage,
  deletePackage,
};
