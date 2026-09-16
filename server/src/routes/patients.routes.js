const express = require("express");
const router = express.Router();
const patientsController = require("../controllers/patients.controller");
const { authMiddleware } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.get("/patients", authMiddleware, patientsController.getPatients);
router.get("/patients/slim", authMiddleware, patientsController.getPatientsSlim);
router.get("/patients/:id", authMiddleware, patientsController.getPatientDetails);
router.post("/patients", authMiddleware, patientsController.addPatient);
router.patch("/patients/:id", authMiddleware, patientsController.editPatient);
router.delete("/patients/:id", authMiddleware, patientsController.deletePatient);

// Patient doc uploads
router.post(
  "/patient_uploads/:id",
  authMiddleware,
  upload.any(),
  patientsController.uploadPatientDocs
);

module.exports = router;
