const async = require('async');
const moment = require('moment');

// Models 
const Users = require('../models/users');

// Helpers Functions
const utilities = require('../helpers/security');
const responseUtilities = require('../helpers/sendResponse');

/**
 * 
 * @param {JSON} data 
 * @param {JSON} response 
 * @param {Function} cb 
 * @description Handles full login flow
 */
 const userLogin = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    if (!data.email || !data.password) {
        return cb(responseUtilities.responseStruct(400, "Email and Password are required", "userLogin", null, data.req.signature));
    }
    let functionsWaterfall = [];
    functionsWaterfall.push(async.apply(checkEmailExistance, data));
    functionsWaterfall.push(async.apply(comparePassword, data));    
    functionsWaterfall.push(async.apply(encryptData, data));
    async.waterfall(functionsWaterfall, cb);
};
exports.userLogin = userLogin;

/**
 * 
 * @param {JSON} data 
 * @param {JSON} response 
 * @param {Function} cb 
 * @description Check email existance of user
 */
 const checkEmailExistance = function (data, response, cb) {
     if(!cb){
        cb = response;
     }
     let findData = {
         email: data.email
     };
     Users.findOne(findData, function(err, user) {
        if (err) {
            return cb(responseUtilities.responseStruct(500, null, "checkEmailExistance", null, data.req.signature));
        }
        if(!user){
            return cb(responseUtilities.responseStruct(403, null, "Invalid User: No User Found", null, data.req.signature));
        }
        return cb(null, responseUtilities.responseStruct(200, null, "checkEmailExistance", user, data.req.signature));
    });
}

/**
 * 
 * @param {JSON} data 
 * @param {JSON} response 
 * @param {Function} cb 
 * @description Compare password while user login
 */
 const comparePassword = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    let hash = null
    let salt = null
    if (response.data) {
        hash = response.data.password;
        salt = response.data.salt;
    } else {
        return cb(responseUtilities.responseStruct(500, null, "comparePassword", null, data.req.signature));
    }
    utilities.comparePassword(data.password, hash, salt, function (err, hash_result) {
        if (err) {
            console.error(err)
            return cb(responseUtilities.responseStruct(500, null, "comparePassword", null, data.req.signature));
        }
        if (hash_result) {
            data._id = response.data._id;
            data.accountId = response.data.accountId;
            data.name = response.data.name;
            data.role = response.data.role;
            return cb(null, responseUtilities.responseStruct(200, "Email - Password Matches", "comparePassword", data, data.req.signature));
        } else {
            return cb(responseUtilities.responseStruct(401, "Invalid ID and Password Combination.", "comparePassword", null, data.req.signature));
        }
    });
};

/**
 * 
 * @param {JSON} data 
 * @param {JSON} response 
 * @param {Function} cb 
 * @description Encrypt data for access-token
 */
 const encryptData = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    let timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    let userData = {
        id: data._id,
        email: data.email,
        accountId: data.accountId,
        createdAt: timestamp,
        role: data.role,
    };

    utilities.encryptData(userData, function (err, res) {
        if (err) {
            console.error(err);
            return cb(responseUtilities.responseStruct(500, null, "encryptData", null, data.req.signature));
        }
        return cb(null, responseUtilities.responseStruct(200, "Successfully Logged In!", "encryptData", {
            user: {
                email: data.email,
                accountId: data.accountId,
                role: data.role
            },
            token: res
        }, data.req.signature));
    });
};