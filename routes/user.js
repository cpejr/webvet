var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');

router.get('/', auth.isAuthenticated, (req, res, next) => {
  Requisition.getAll().then((requisitions) => {
    console.log(requisitions);
    res.render('user', { title: 'Cliente', layout: 'layoutDashboard.hbs', requisitions, ...req.session });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

module.exports = router;
