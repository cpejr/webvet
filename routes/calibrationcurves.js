const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Kit = require('../models/kit');

router.get('/', function(req, res, next) {
  res.render('calibrationcurves', { title: 'Curvas de Calibração', layout: 'layoutDashboard.hbs'});
});

module.exports = router;
