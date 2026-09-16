const express = require("express");
const router = express.Router();
const doctorsController = require("../controllers/doctors.controller");
const { authMiddleware } = require("../middleware/auth");

router.get("/doctors", authMiddleware, doctorsController.getDoctors);
router.get("/doctors/:id", authMiddleware, doctorsController.getDoctorDetails);
router.post("/doctors", authMiddleware, doctorsController.addDoctor);
router.patch("/doctors/:id", authMiddleware, doctorsController.editDoctor);
router.delete("/doctors/:id", authMiddleware, doctorsController.deleteDoctor);

module.exports = router;
