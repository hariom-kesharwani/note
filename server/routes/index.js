'use strict';

var note = require('../controllers/note.js');
var express = require('express');

var router = express.Router({
    mergeParams: true
});

//Add & Edit Note
router.post('/note/add_note', function(req, res) {
    note.addNote(req, res);
});
//List Note
router.post('/note/list_note', function(req, res) {
    note.listNote(req, res);
});
// Get Note detail
router.get('/note/get_note/:note_id', function(req, res) {
    note.getNoteDetail(req, res);
});

// Delete Note detail
router.get('/note/delete_note/:note_id', function(req, res) {
    note.deleteNote(req, res);
});

module.exports = (app) => {
    addFrontendRoutes(app);
    addConciergeRoutes(app, router);
    app.use('/', router);
};
