const express = require('express');
const router = express.Router();

/* Middlewares */
const formatRequest = require('../../middlewares/formatRequest');
router.use(formatRequest);
const clients = {
    users: {
        host: process.env.SERVICE_RPC_HOST,
        port: process.env.GFB_USER_PORT
    }
};
const data = {
    platform: "ATS"
};
const authenticator = require('../../middlewares/authenticator')(clients, data);
const authenticateRole = require('../../middlewares/authenticateRole');

/* Controllers */
const aadhar = require('../../controllers/aadhar')

/* Get Aadhars */
router.get(
    '/v1/get', 
    [authenticator, authenticateRole(["ADMIN"])], 
    function(req, res, next){
    let data = req.query;
    data.req = req.data;    
    aadhar.getAllAdhars(data, function(err, response) {
        let status = 0;
        if (err) {
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    })
});

module.exports = router;