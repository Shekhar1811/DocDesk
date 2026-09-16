const prisma = require("../config/prisma");
const moment = require("moment");

const getNotes = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const notes = await prisma.note.findMany({
      where: clinicId ? { clinic_id: clinicId } : undefined,
      orderBy: { id: "desc" },
    });
    return res.status(200).json(notes);
  } catch (error) {
    console.error("getNotes error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch notes" });
  }
};

const getNoteDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    return res.status(200).json(note);
  } catch (error) {
    console.error("getNoteDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch note details" });
  }
};

const addNote = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { title, description, date } = req.body;

    const newNote = await prisma.note.create({
      data: {
        clinic_id: clinicId,
        title: title || "Clinical Note",
        description: description || "",
        date: String(date || moment().format("YYYY-MM-DD")),
      },
    });

    return res.status(200).json({ success: true, data: newNote });
  } catch (error) {
    console.error("addNote error:", error);
    return res.status(500).json({ error: true, message: "Failed to create note" });
  }
};

const editNote = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, date } = req.body;

    const updated = await prisma.note.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        date: date !== undefined ? String(date) : undefined,
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("editNote error:", error);
    return res.status(500).json({ error: true, message: "Failed to update note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.note.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("deleteNote error:", error);
    return res.status(500).json({ error: true, message: "Failed to delete note" });
  }
};

module.exports = {
  getNotes,
  getNoteDetails,
  addNote,
  editNote,
  deleteNote,
};
