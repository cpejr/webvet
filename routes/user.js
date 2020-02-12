const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');

router.get('/', auth.isAuthenticated, (req, res, next) => {
  Requisition.getAllInProgress().then((requisitions) => {
    var data = [];
    for (let i = 0; i < requisitions.length; i++) {
      const element = requisitions[i];
      data[i] = {
        number: element.requisitionnumber,
        year: element.createdAt.getFullYear(),
      };
    }

    res.render('user', { title: 'Cliente', layout: 'layoutDashboard.hbs', data, ...req.session });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

module.exports = router;
