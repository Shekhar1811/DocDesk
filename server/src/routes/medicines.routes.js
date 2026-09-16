const express = require("express");
const router = express.Router();
const medicinesController = require("../controllers/medicines.controller");
const { authMiddleware } = require("../middleware/auth");

router.get("/medicines", authMiddleware, medicinesController.getMedicines);
router.get("/medicines/:id", authMiddleware, medicinesController.getMedicineDetails);
router.post("/medicines", authMiddleware, medicinesController.addMedicine);
router.patch("/medicines/:id", authMiddleware, medicinesController.editMedicine);
router.delete("/medicines/:id", authMiddleware, medicinesController.deleteMedicine);
router.get("/master_medicines", authMiddleware, medicinesController.getMasterMedicines);

// Prescriptions
router.get("/prescriptions", authMiddleware, medicinesController.getPrescriptions);
router.post("/prescriptions", authMiddleware, medicinesController.addPrescriptions);
router.patch("/prescriptions/:id", authMiddleware, medicinesController.editPrescriptions);
router.delete("/prescriptions/:id", authMiddleware, medicinesController.deletePrescription);

module.exports = router;
