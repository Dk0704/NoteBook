const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Get all notes of a user using GET /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {

        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");

    }
})

// Add a note of a user using POST /api/notes/addnote
router.post('/addnote', [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 chars').isLength({ min: 5 })
], fetchuser, async (req, res) => {
    try {
        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savednote = await note.save();
        res.json(savednote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})


// Update a note of a user using PUT /api/notes/updatenote
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const {title, description, tag} = req.body;
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")};
        if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed")};
        
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

// Delete a note of a user using DELETE /api/notes/updatenote
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        const {title, description, tag} = req.body;
                
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")};

        if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed")};
        
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success": "Note has been deleted", note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})
module.exports = router;