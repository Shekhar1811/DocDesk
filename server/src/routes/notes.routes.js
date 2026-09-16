const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes.controller");
const { authMiddleware } = require("../middleware/auth");

router.get("/notes", authMiddleware, notesController.getNotes);
router.get("/notes/:id", authMiddleware, notesController.getNoteDetails);
router.post("/notes", authMiddleware, notesController.addNote);
router.patch("/notes/:id", authMiddleware, notesController.editNote);
router.delete("/notes/:id", authMiddleware, notesController.deleteNote);

module.exports = router;
