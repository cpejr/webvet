const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');
const Kitstock = require('../models/kitstock');



router.get('/', auth.isAuthenticated,  function(req,res) {
  Kitstock.getAll().then((kitstock) => {
    console.log(kitstock);
    res.render('requisition', {title:'Requisition',layout:'layoutDashboard.hbs', ...req.session });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });

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
    var i;
    var numDefault=1;
    const samplesV = [];
    var size;

    if(Array.isArray(req.body.requisition.sampleVector)) {
      req.body.requisition.sampleVector.forEach(function(sample)  {//monta o vetor de amostras
            samplesV.push(sample);
      });
      size=samplesV.length;
    }
    else {
      size=1;
    }


   Sample.getMaxSampleNumber().then((maxSample) => {//pega maior numero atribuido as amostras do banco
      Sample.count().then((countSample)=>{
        if(countSample==0) { //se o banco esta vazio
          console.log("BANCO VAZIOOOO");
             for(i = 0; i< size; i++) {
                const sample = {
                  name: samplesV[i],
                  samplenumber: numDefault,
                  responsible: req.body.responsible
                }
                console.log(sample);
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
        else{  //banco não esta vazio
            console.log("BANCO COM AMOSTRAAAAASSSS")
            numDefault=maxSample[0].samplenumber+1;
            for(i = 0; i< size; i++) {
               const sample = {
                 name: samplesV[i],
                 samplenumber: numDefault,
                 responsible: req.body.responsible
               }
               console.log(sample);
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
      }).catch((error) => {
        console.log(error);
        res.redirect('/error'); });
   }).catch((error) => {
      console.log(error);
     res.redirect('/error'); });//catch do getMaxSampleNumber



    console.log(`New requisition with id: ${reqid}`);
    req.flash('success', 'Nova requisição enviada');
    res.redirect('/homeAdmin');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');//catch do create
 });
});


module.exports = router;
