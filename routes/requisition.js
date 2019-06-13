const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');


router.get('/new', auth.isAuthenticated, function(req, res) {
  res.render('requisition', {title:'Requisição',layout:'layoutDashboard_user.hbs'});
});


router.post('/new', auth.isAuthenticated, function(req,res) {
  const newRequisition = req.body;

  if (req.body.producerAddress == "0") {

  }

  Requisition.create(newRequisition).then((userID) => {
    console.log(`New requisition with user id: ${userID}`);
    req.flash('success', 'Nova requisição enviada')
    res.redirect('/homeAdmin');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

module.exports = router;
