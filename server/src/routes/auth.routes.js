const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.get("/user", authMiddleware, authController.getUser);
router.patch("/user_update/:id", authMiddleware, authController.updateUser);

module.exports = router;
