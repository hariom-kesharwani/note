const noteModel = require('../../models/notes');
const mongoose = require('mongoose');

/*
API used to Add note and Update note.
*/
const addNote = function(req, res) {

    if(!req.body.users_id || is_empty(req.body.text)){
      return res.json({code: 400, msg: 'Invalid Input'});
    }
    var noteData = {
      users_id: mongoose.Types.ObjectId(req.body.users_id),
      text: mongoose.Types.ObjectId(req.body.text)
    };
    if(req.body.note_id){
        noteModel.findByIdAndUpdate(req.body.note_id, noteData , function(err, data) {
            if (err) {
              return res.json({
                  code: 401,
                  msg: err
              });
            }else if(is_empty(data)){
              return res.json({
                  code: 401,
                  msg: 'Invalid request.'
              });
            }
            return res.json({code: 200, msg: 'Note updated successfully.'});
        });
    }else{
        noteModel(noteData).save(function (err, data) {
            if (err) {
                return res.json({
                    code: 401,
                    msg: err
                });
            }
            return res.json({code: 200, msg: 'Note created successfully.'});
        });
    }
    
};
module.exports.addNote = addNote;

/*
Get note detail
*/
const getNoteDetail = function(req, res) {
  
    if(!req.params.note_id){
      return res.json({code: 400, msg: 'Invalid Input'});
    }
    noteModel.findOne({
      _id: req.params.note_id
    }, function ( err, noteData ) {
      if (err) {
          return res.json({
              code: 401,
              msg: err
          });
      }else if(is_empty(noteData)){
        return res.json({
            code: 401,
            msg: 'Invalid request.'
        });
      }
      return res.json({
        code: 200,
        msg: 'Data fetched Successfully.',
        data: noteData
      });
    })
    .populate('users_id',{firstname:1,lastname:1,email:1});
}
module.exports.getNoteDetail = getNoteDetail;

/*
List note data
*/
const listNote = function(req, res) {
    var conditions = {
      status: true,
      is_deleted: false
    }
    if(!is_empty(req.body.text)){
      conditions.text = {$regex: new RegExp(req.body.text, "i")}
    }
    if('page_number' in req.body && req.body.page_number<0){
      return res.json({code: 400, msg: 'Invalid Input'});
    }
    pageNumber = 0;
    pageSize = 10;
    if(req.body.page_number>=0){
      pageNumber = req.body.page_number;
    }
    noteModel.find(conditions, function ( err, noteData ) {
      if (err) {
          return res.json({
              code: 401,
              msg: err
          });
      }
      return res.json({
        code: 200,
        msg: 'Data fetched Successfully.',
        data: noteData
      });
    })
    .populate('users_id',{firstname:1,lastname:1,email:1})
    .sort({created: -1})
    .skip(pageNumber * 10)
    .limit(pageSize);
  }
  module.exports.listNote = listNote;
/*
API for delete the note
*/
const deleteNote = function(req, res) {
  
    if(!req.params.note_id){
      return res.json({code: 400, msg: 'Invalid Input'});
    }
    noteModel.findByIdAndUpdate(req.params.note_id,{is_deleted:true}, function ( err, noteData ) {
      if (err) {
          return res.json({
              code: 401,
              msg: err
          });
      }else if(is_empty(noteData)){
        return res.json({
            code: 401,
            msg: 'Invalid request.'
        });
      }
      return res.json({
        code: 200,
        msg: 'Note deleted Successfully.',
      });
    });
}
module.exports.deleteNote = deleteNote;
function is_empty(data) {
    if (typeof(data) == 'number' || typeof(data) == 'boolean') {
        return false;
    }
    if (typeof(data) == 'undefined' || data === null) {
        return true;
    }
    if (typeof(data.length) != 'undefined') {
        return data.length == 0;
    }
    count = 0;
    for (i in data) {
        if (data.hasOwnProperty(i)) {
            count++;
        }
    }
    return count == 0;
}