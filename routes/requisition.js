const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');



router.get('/', auth.isAuthenticated,  function(req,res) {
  res.render('requisition', {title:'Requisition',layout:'layoutDashboard.hbs', ...req.session });
});


router.post('/new', function(req,res) {
  const { requisition } = req.body;
  if (req.body.producerAddress == 0) {
    console.log("thayan lindo");
    const address = req.session.user.adress;
    console.log(req.session.user.adress);
    requisition.address = address;

  }

  


  console.log(requisition);
  Requisition.create(requisition).then((reqid) => {
    var size = requisition.sampleVector;
    var i;
    for(i = 0; i< size.length; i++) {
      Sample.getMaxSampleNumber().then((maxSample) => {
        const sample = {
          name: requisition.sampleVector[i],
          samplenumber: maxSample[0].samplenumber + 1
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
