const express = require("express");
const router = express.Router();
const invoicesController = require("../controllers/invoices.controller");
const { authMiddleware } = require("../middleware/auth");

// Specific routes first
router.get("/invoices/reports", authMiddleware, invoicesController.getReports);
router.get("/invoices/stats", authMiddleware, invoicesController.getStats);

// Public invoice print route (no auth required for print/QR view)
router.get("/print_invoice/:id", invoicesController.getPrintInvoiceDetails);

// Standard CRUD
router.get("/invoices", authMiddleware, invoicesController.getInvoices);
router.get("/invoices/:id", authMiddleware, invoicesController.getInvoiceDetails);
router.post("/invoices", authMiddleware, invoicesController.addInvoice);
router.patch("/invoices/:id", authMiddleware, invoicesController.editInvoice);

module.exports = router;
