const express = require("express");
const router = express.Router();
const {addNote, editNote, getAllNotes, deleteNote, updateisPinned, searchNotes} = require("../controllers/notesController");
const {authenticateToken} = require("../utilities")
router.post('/add-note',authenticateToken, addNote)
router.put('/edit-note/:noteId',authenticateToken, editNote)
router.put('/update-note-pinned/:noteId',authenticateToken,updateisPinned)
router.delete('/delete-note/:noteId',authenticateToken, deleteNote);
router.get('/get-all-notes', authenticateToken, getAllNotes);
router.get('/search-notes', authenticateToken, searchNotes);
module.exports = router;