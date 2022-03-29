'use strict';

const config = require('../config/index');
const crypto = require('crypto');
const mongoose = require('mongoose');
const salt = crypto.randomBytes(16).toString('base64')
const randomSalt = new Buffer(salt, 'base64');

// MODELS
const Users = require('../models/users');

// Seeding User...........
let users = [
    {
        _id: mongoose.Types.ObjectId('60548d6169865823f0aa776a'),
        name: "Admin",
        email: "admin@aadhar.in",
        role: "ADMIN",
        password: crypto.pbkdf2Sync('admin@123', randomSalt, 10000, 64, 'sha1').toString('base64'),
        salt: salt,
        accountId: "81810606",
    },
]

Users.find({}, (err, res) => {
    if (err || res.length > 0) {
        return;
    }
    else {
        Users.create(users, (err, response) => {
            if (err) {
                console.error("Unable to create user", err);
                return
            }
            console.log("Users Created");
        });

    }
});

