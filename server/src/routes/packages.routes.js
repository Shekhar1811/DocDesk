const express = require("express");
const router = express.Router();
const packagesController = require("../controllers/packages.controller");
const { authMiddleware } = require("../middleware/auth");

router.get("/packages", authMiddleware, packagesController.getPackages);
router.get("/packages/:id", authMiddleware, packagesController.getPackageDetails);
router.post("/packages", authMiddleware, packagesController.addPackage);
router.patch("/packages/:id", authMiddleware, packagesController.editPackage);
router.delete("/packages/:id", authMiddleware, packagesController.deletePackage);

module.exports = router;
