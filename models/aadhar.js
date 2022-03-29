let mongoose = require('./db');
let Schema = mongoose.Schema;

var aadharSchema = new Schema({
    aadharNumber : { type: String, unique: true},
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
},{timestamps: true});

module.exports = mongoose.model('aadhar', aadharSchema);