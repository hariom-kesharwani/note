/*** Module dependencies.*/
var mongoose = require('mongoose');

/*** note Schema*/

var DBschema = new mongoose.Schema({
    text: {type: String},
    users_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    created: {type: Date, default: Date.now},
    is_deleted: {type: Boolean, default: false},
    status: {type: Boolean, default: true}
});
module.exports = mongoose.model('notes', DBschema);