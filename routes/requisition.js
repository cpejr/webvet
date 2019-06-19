const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');



router.get('/',  function(req,res) {
  res.render('requisition', {title:'Requisition',layout:'layoutDashboard.hbs'});
});


router.post('/new', function(req,res) {
  const address = {};
  const { requisition }= req.body;
  if (requisition.address.street.length === 0) {
    const address = req.session.address;
  }

  requisition.address = address;

  console.log(requisition);
  Requisition.create(requisition).then((reqid) => {
    var size = requisition.sampleVector;
    var i;
    for(i = 0; i<size.length; i++) {
      const sample = {
        name: requisition.sampleVector[i]
      }
      console.log(sample);
      Sample.create(sample).then((sid) => {
        console.log(`New Sample with id: ${sid}`);
        Requisition.addSample(reqid, sid).catch((error) => {
          console.log(error);
          res.redirect('/error');
        })
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      });
    }
    console.log(`New requisition with id: ${reqid}`);
    req.flash('success', 'Nova requisição enviada')
    res.redirect('/homeAdmin');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
