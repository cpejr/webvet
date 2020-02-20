const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');
const User = require('../models/user');
const Samples = require('../models/sample');

router.get('/', auth.isAuthenticated, (req, res, next) => {
  const currentUser = firebase.auth().currentUser.uid;
  User.getOneByQuery({ uid: currentUser }).then((user) => {
    Requisition.getAllNewById(user._id).then((requisitions) => {
      var data = [];
      var samplesId = [];
      for (let i = 0; i < requisitions.length; i++) {
        const element = requisitions[i];
        data[i] = {
          number: element.requisitionnumber,
          year: element.createdAt.getFullYear(),
        };
        for (let j = 0; j < requisitions[i].samples.length; j++) {
          samplesId.push(requisitions[i].samples[j]);
        }
      }
      Samples.getByIdArray(samplesId).then((samples) => {
        var laudos = [];
        for (let k = 0; k < samples.length; k++){
          console.log(samples[k].report);
          if(samples[k].report === true){
            laudos.push(samples[k]);
          }
        }
        var laudEmpty = true;
        if (laudos.length > 0){
          laudEmpty = false;
        }
        res.render('user', { title: 'Cliente', layout: 'layoutDashboard.hbs', data, laudos, laudEmpty,...req.session });
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
