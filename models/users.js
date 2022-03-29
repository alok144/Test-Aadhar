let mongoose = require('./db');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: String,
    email: { type:String, unique:true },
    accountId: Number,
    password: String,
    salt: String,
    lastName: String,
    mobile: String,
    role: {type: String, enum: JSON.parse(process.env.ROLE), default: 'USER'}
}, { timestamps: true} );

let users = mongoose.model('User', userSchema);

module.exports = users;