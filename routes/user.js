const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');
const User = require('../models/user');
const Samples = require('../models/sample');
const Covenant = require('../models/covenant');

router.get('/', auth.isAuthenticated, (req, res) => {
  const currentUser = firebase.auth().currentUser.uid;
  User.getOneByQuery({ uid: currentUser }).then((user) => {
    Requisition.getAllByUserId(user._id).then((requisitions) => {
      var data = [];
      var samplesId = [];
      for (let i = 0; i < requisitions.length; i++) {
        const element = requisitions[i];
        data[i] = {
          number: element.requisitionnumber,
          year: element.createdAt.getFullYear(),
          _id: element._id,
        };
        for (let j = 0; j < requisitions[i].samples.length; j++) {
          samplesId.push(requisitions[i].samples[j]);
        }
      }
      Samples.getFinalizedByIdArray(samplesId).then((samples) => {
        var laudos = [];
        for (let k = 0; k < samples.length; k++){
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

router.post('/removeFromCovenant/:id', auth.isAuthenticated, auth.isAdmin, async function (req, res){
  console.log('Entrou na rota delete');
  console.log("req.params.id = " + req.params.id);
  const { id } = req.params;
  console.log("req.body.covenant = " + req.body.covenant);
  const cId = req.body.covenant.id;
  console.log(cId);
  await Covenant.removeManager(cId, id);
  await User.removeCovenant([id]);
  console.log("Convenio deletado!");
  res.redirect(`/covenant/edit/${cId}`)
});

module.exports = router;
