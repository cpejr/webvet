const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Requisition = require('../models/requisition');
const User = require('../models/user');

// O IS isAuthenticated TA COMENTADO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {
  res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs',...req.session});
});

module.exports = router;
