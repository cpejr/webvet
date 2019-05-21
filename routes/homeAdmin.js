var express = require('express');
var router = express.Router();
var mongoose = require('mongodb');
const Sample = require('../models/sample');
const Requisition = require('../models/requisition');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {

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
