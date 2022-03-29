const express = require('express');
const router =  express.Router();

const auth = require('./auth');
const aadhar = require('./aadhar');

router.use('/auth', auth);
router.use('/aadhars', aadhar);
module.exports = router;