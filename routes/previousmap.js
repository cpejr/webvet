const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Workmap = require('../models/Workmap');

/* GET home page. */
router.get('/', /*auth.isAuthenticated,*/ function (req, res, next) {
  Workmap.getLastFinalizedSamples();
  res.render('previousmap', { ...req.session });
});
module.exports = router;
