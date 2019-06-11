var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');

router.get('/', (req, res, next) => {
  Requisition.getAll().then((requisitions) => {
    console.log(requisitions);
    res.render('record/index', { title: 'Histórico', layout: 'layoutDashboard.hbs', requisitions, ...req.session });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

module.exports = router;