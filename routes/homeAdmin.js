var express = require('express');
var router = express.Router();
var mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Requisition = require('../models/requisition');
const User = require('../models/user');
const Kit = require('../models/kit');

/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {

  User.count().then((countClients) => {
      Sample.count().then((countSamples) => {
            Requisition.count().then((countRequisitions) => {
              console.log(countClients);
              console.log(countSamples);
              console.log(countRequisitions);
              res.render('admin/homeAdmin', { title: 'Home', layout: 'layoutDashboard.hbs', countClients, countSamples, countRequisitions, ...req.session });
            }).catch((error) => {
              console.log(error);
              res.redirect('/error');
            });
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

module.exports = router;
