const express = require("express");
const router = express.Router();
const clinicController = require("../controllers/clinic.controller");
const { authMiddleware } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.get("/clinics/:id", clinicController.getClinic);
router.patch("/clinics/:id", authMiddleware, clinicController.editClinic);

// Clinic Assets uploads
router.post(
  "/clinic_logo_uploads/:id",
  authMiddleware,
  upload.single("assets[0]"),
  clinicController.uploadClinicAsset("logo")
);
router.post(
  "/clinic_favicon_uploads/:id",
  authMiddleware,
  upload.single("assets[0]"),
  clinicController.uploadClinicAsset("favicon")
);
router.post(
  "/clinic_scanner_uploads/:id",
  authMiddleware,
  upload.single("assets[0]"),
  clinicController.uploadClinicAsset("scanner")
);
router.post(
  "/clinic_uploads/:id",
  authMiddleware,
  upload.single("assets[0]"),
  clinicController.uploadClinicAsset("logo")
);

module.exports = router;
