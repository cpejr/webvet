const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');



router.get('/', auth.isAuthenticated,  function(req,res) {
  console.log(req.session.user);
  res.render('requisition', {title:'Requisition',layout:'layoutDashboard.hbs', ...req.session });
});


router.post('/new', function(req,res) {
  const { requisition } = req.body;
  if (req.body.producerAddress == 0) {
    console.log("MINI BOIIIII");
    const address = req.session.user.address;
    console.log(req.session.user.address);
    requisition.address = address;

  }




  console.log(requisition);
  Requisition.create(requisition).then((reqid) => {
    var size = requisition.sampleVector;
    var i;
    var numDefault=1;
    var numOfSamples;
    console.log(Array.isArray(requisition.sampleVector))
    Sample.count().then((countSample)=>{
         numOfSamples=countSample;
    }).catch((error) => {
      console.log(error);
      res.redirect('/error'); });

    if(countSample=0) { //se o banco esta vazio
       if(Array.isArray(requisition.sampleVector)==true){//se tiver varias amostras
          for(i = 0; i< size.length; i++) {
            const sample = {
              name: requisition.sampleVector[i],
              samplenumber: numDefault
            }
            Sample.create(sample).then((sid) => {
              console.log(`New Sample with id: ${sid}`);
              Requisition.addSample(reqid, sid).catch((error) => {
                console.log(error);
                res.redirect('/error');
              });
            }).catch((error) => {
              console.log(error);
              res.redirect('/error');
            });
            numDefault++;
        }
      }
      else {//se tiver so uma amostra
        const sample = {
          name: requisition.sampleVector,
          samplenumber: numDefault
        }
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
    }

    else{  //banco não esta vazio
        if(Array.isArray(requisition.sampleVector)==true){//se tiver varias amostras
             for(i = 0; i< size.length; i++) {
               Sample.getMaxSampleNumber().then((maxSample) => {
                   const sample = {
                     name: requisition.sampleVector[i],
                     samplenumber: maxSample[0].samplenumber+1
                    }
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
        }
      else { //somente uma amostra vindo do front
          Sample.getMaxSampleNumber().then((maxSample) => {
              const sample = {
                name: requisition.sampleVector[i],
                samplenumber: maxSample[0].samplenumber+1
               }
              Sample.create(sample).then((sid) => {
                console.log(`New Sample with id: ${sid}`);
                Requisition.addSample(reqid, sid).catch((error) => {
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
       }
    }

    console.log(`New requisition with id: ${reqid}`);
    req.flash('success', 'Nova requisição enviada');
    res.redirect('/homeAdmin');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
});


module.exports = router;
