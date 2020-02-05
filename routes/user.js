const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');

router.get('/', auth.isAuthenticated, (req, res, next) => {
  Requisition.getAll().then((requisitions) => {
    res.render('user', { title: 'Cliente', layout: 'layoutDashboard.hbs', requisitions, ...req.session });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

module.exports = router;
