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
const data = {};
const authenticator = require('../../middlewares/authenticator')(clients, data);
const authenticateRole = require('../../middlewares/authenticateRole');

module.exports = router;