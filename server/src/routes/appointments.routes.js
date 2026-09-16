const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointments.controller");
const { authMiddleware } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.get("/appointments", authMiddleware, appointmentsController.getAppointments);
router.get("/appointments/:id", authMiddleware, appointmentsController.getAppointmentDetails);
router.post("/appointments", authMiddleware, appointmentsController.addAppointment);
router.patch("/appointments/:id", authMiddleware, appointmentsController.editAppointment);
router.delete("/appointments/:id", authMiddleware, appointmentsController.deleteAppointment);

// Appointment asset uploads
router.post(
  "/appointment_uploads/:id",
  authMiddleware,
  upload.any(),
  appointmentsController.uploadAppointmentDocs
);

module.exports = router;
