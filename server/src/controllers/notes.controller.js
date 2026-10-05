const prisma = require("../config/prisma");
const moment = require("moment");

const formatNote = (n) => {
  if (!n) return null;
  return {
    id: n.id,
    title: n.title,
    name: n.title,
    description: n.description || "",
    date: n.date || "",
    created_at: n.created_at,
    updated_at: n.updated_at,
  };
};

const getNotes = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const notes = await prisma.note.findMany({
      where: clinicId ? { clinic_id: clinicId } : undefined,
      orderBy: { id: "desc" },
    });
    return res.status(200).json(notes.map(formatNote));
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
    return res.status(200).json(formatNote(note));
  } catch (error) {
    console.error("getNoteDetails error:", error);
    return res.status(500).json({ error: true, message: "Failed to fetch note details" });
  }
};

const addNote = async (req, res) => {
  try {
    const clinicId = req.clinicId || (await prisma.clinic.findFirst())?.id || 1;
    const { title, name, description, date } = req.body;

    const newNote = await prisma.note.create({
      data: {
        clinic_id: clinicId,
        title: title || name || "Clinical Note",
        description: description || "",
        date: String(date || moment().format("YYYY-MM-DD")),
      },
    });

    return res.status(200).json({ success: true, data: formatNote(newNote) });
  } catch (error) {
    console.error("addNote error:", error);
    return res.status(500).json({ error: true, message: "Failed to create note" });
  }
};

const editNote = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, name, description, date } = req.body;
    const finalTitle = title !== undefined ? title : (name !== undefined ? name : undefined);

    const updated = await prisma.note.update({
      where: { id },
      data: {
        title: finalTitle !== undefined ? finalTitle : undefined,
        description: description !== undefined ? description : undefined,
        date: date !== undefined ? String(date) : undefined,
      },
    });

    return res.status(200).json({ success: true, data: formatNote(updated) });
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
